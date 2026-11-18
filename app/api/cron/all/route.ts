import { NextRequest, NextResponse } from "next/server";
import { executeCronJob } from "@/lib/cron/logger";

export async function GET(request: NextRequest) {
  return handleJob(request);
}

export async function POST(request: NextRequest) {
  return handleJob(request);
}

async function handleJob(request: NextRequest) {
  return executeCronJob("all_scheduled_jobs", request, async () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3005";
    const cronSecret = process.env.CRON_SECRET || "";
    const headers: Record<string, string> = {};
    if (cronSecret) {
      headers["Authorization"] = `Bearer ${cronSecret}`;
    }

    const endpoints = [
      `${siteUrl}/api/cron/reminders`,
      `${siteUrl}/api/cron/expiring-bookings`,
      `${siteUrl}/api/cron/membership-checks`,
      `${siteUrl}/api/cron/daily-admin-digest`,
    ];

    const results: Record<string, any> = {};

    for (const url of endpoints) {
      const jobKey = url.split("/").pop() || "unknown";
      try {
        const res = await fetch(url, { headers });
        results[jobKey] = await res.json();
      } catch (err: any) {
        results[jobKey] = { error: err.message };
      }
    }

    return results;
  });
}

