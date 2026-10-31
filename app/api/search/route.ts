import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const empty = { services: [], subjects: [], posts: [], faqs: [] };
  if (!q || q.length < 2) return NextResponse.json(empty);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(empty);
  }

  try {
    const supabase = await createClient();
    const [services, subjects, posts, faqs] = await Promise.all([
      supabase
        .from("services")
        .select("slug,title,summary")
        .eq("is_active", true)
        .or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
        .limit(5),
      supabase
        .from("subjects")
        .select("slug,title,summary")
        .or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
        .limit(5),
      supabase
        .from("blog_posts")
        .select("slug,title,standfirst")
        .eq("status", "published")
        .or(`title.ilike.%${q}%,standfirst.ilike.%${q}%`)
        .limit(5),
      supabase
        .from("faqs")
        .select("question,answer")
        .eq("is_published", true)
        .ilike("question", `%${q}%`)
        .limit(5),
    ]);

    return NextResponse.json({
      services: services.data ?? [],
      subjects: subjects.data ?? [],
      posts: posts.data ?? [],
      faqs: faqs.data ?? [],
    });
  } catch {
    return NextResponse.json(empty);
  }
}

