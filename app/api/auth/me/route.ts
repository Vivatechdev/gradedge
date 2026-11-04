import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      const cookieStore = await cookies();
      const mockRole = cookieStore.get("mock_user_role")?.value;
      if (mockRole) {
        return NextResponse.json({
          user: {
            id: "mock-google-user",
            email: "google.scholar@university.edu",
            full_name: "Google Scholar",
          },
          profile: {
            id: "mock-google-user",
            full_name: "Google Scholar",
            email: "google.scholar@university.edu",
            role: mockRole,
            study_level: "",
            field_of_study: "",
            institution: "",
            terms_accepted_at: null,
          },
        });
      }
      return NextResponse.json({ user: null, profile: null }, { status: 401 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ user: null, profile: null }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name:
          profile?.full_name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "",
      },
      profile,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
