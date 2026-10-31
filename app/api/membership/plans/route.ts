import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json([]);
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("membership_plans")
      .select("*")
      .eq("is_active", true)
      .order("price_monthly_minor");

    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json([]);
  }
}

