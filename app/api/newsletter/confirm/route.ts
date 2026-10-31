import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ success: true, mocked: true });
  }

  try {
    const supabase = createServiceRoleClient();
    await supabase
      .from("newsletter_subscribers")
      .update({ confirmed: true })
      .eq("id", token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to confirm" }, { status: 500 });
  }
}

