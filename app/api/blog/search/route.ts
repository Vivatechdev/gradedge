import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (!q || q.length < 2) return NextResponse.json([]);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json([]);
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug,title,standfirst,reading_time_minutes")
      .eq("status", "published")
      .or(`title.ilike.%${q}%,standfirst.ilike.%${q}%`)
      .limit(10);

    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json([]);
  }
}

