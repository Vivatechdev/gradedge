import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid academic email address" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: true, mocked: true });
    }

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: parsed.data.email,
      confirmed: false,
      consent_at: new Date().toISOString(),
    });

    if (error?.code === "23505") {
      return NextResponse.json({ error: "This email is already subscribed" }, { status: 409 });
    }

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

