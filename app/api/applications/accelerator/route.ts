import { NextRequest, NextResponse } from "next/server";
import { programApplicationSchema } from "@/lib/validators";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = programApplicationSchema.safeParse(body);
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
    const { error } = await supabase.from("program_applications").insert(parsed.data);

    if (error) {
      return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

