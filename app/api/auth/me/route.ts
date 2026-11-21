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
        const mockEmail = cookieStore.get("mock_user_email")?.value || "scholar@gradedge.com";
        const mockName =
          cookieStore.get("mock_user_name")?.value ||
          (mockRole === "admin"
            ? "System Administrator"
            : mockRole === "mentor"
            ? "Dr. Eleanor Vance"
            : "Doctoral Scholar");

        return NextResponse.json({
          user: {
            id: "mock-user-id",
            email: mockEmail,
            full_name: mockName,
          },
          profile: {
            id: "mock-user-id",
            full_name: mockName,
            email: mockEmail,
            role: mockRole,
            study_level: "phd",
            field_of_study: "Research Methodology",
            institution: mockRole === "admin" ? "GradEdge Operations" : "University of Cambridge",
            terms_accepted_at: new Date().toISOString(),
            profile_completed_at: new Date().toISOString(),
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
