import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/validators";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot check
    if (body.website) {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: true, mocked: true });
    }

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("leads").insert({
      ...parsed.data,
      source: "contact-form",
    });

    if (error) {
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

