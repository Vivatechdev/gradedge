import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export interface CronRunContext {
  jobName: string;
  request: NextRequest;
}

export interface CronRunResult {
  success: boolean;
  jobName: string;
  durationMs: number;
  details: Record<string, any>;
  error?: string;
}

/**
 * Validates request authorization using CRON_SECRET or Vercel cron headers.
 */
export function verifyCronAuth(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    // In local development or mock mode without a secret configured, allow execution
    return true;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  // Support Vercel Cron header if secret matches or standard vercel-cron header
  const vercelHeader = request.headers.get("x-vercel-cron");
  if (vercelHeader && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  return false;
}

/**
 * Executes a cron task with error boundary, execution timing, and persistent run logging to cron_runs.
 */
export async function executeCronJob(
  jobName: string,
  request: NextRequest,
  taskFn: () => Promise<Record<string, any>>
): Promise<NextResponse> {
  // 1. Authorization check
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: "Unauthorized cron invocation" }, { status: 401 });
  }

  const startTime = Date.now();
  let logId: string | null = null;
  const isDbAvailable = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // 2. Initial log insertion
  if (isDbAvailable) {
    try {
      const supabase = createServiceRoleClient();
      const { data } = await supabase
        .from("cron_runs")
        .insert({
          job_name: jobName,
          status: "running",
          started_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (data) logId = data.id;
    } catch (e) {
      console.warn(`[Cron Run Initial Log Error (${jobName})]`, e);
    }
  }

  try {
    // 3. Execute the idempotent job
    const details = await taskFn();
    const durationMs = Date.now() - startTime;

    // 4. Update log to success
    if (isDbAvailable && logId) {
      try {
        const supabase = createServiceRoleClient();
        await supabase
          .from("cron_runs")
          .update({
            status: "success",
            completed_at: new Date().toISOString(),
            duration_ms: durationMs,
            details,
          })
          .eq("id", logId);
      } catch (logErr) {
        console.warn(`[Cron Log Update Error (${jobName})]`, logErr);
      }
    }

    console.log(`[CRON ${jobName}] Completed successfully in ${durationMs}ms`, details);

    return NextResponse.json({
      success: true,
      jobName,
      durationMs,
      details,
    });
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    const errorMessage = error?.message || String(error);

    if (isDbAvailable && logId) {
      try {
        const supabase = createServiceRoleClient();
        await supabase
          .from("cron_runs")
          .update({
            status: "failed",
            completed_at: new Date().toISOString(),
            duration_ms: durationMs,
            error_message: errorMessage,
          })
          .eq("id", logId);
      } catch (logErr) {
        console.warn(`[Cron Log Failure Update Error (${jobName})]`, logErr);
      }
    }

    console.error(`[CRON ${jobName} FAILED] Duration: ${durationMs}ms:`, errorMessage);

    return NextResponse.json(
      {
        success: false,
        jobName,
        durationMs,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

