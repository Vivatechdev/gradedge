import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  return handleSignOut(request);
}

export async function GET(request: NextRequest) {
  return handleSignOut(request);
}

async function handleSignOut(request: NextRequest) {
  const url = new URL(request.url);
  const scope = url.searchParams.get("scope") || "local";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut({
        scope: scope === "global" ? "global" : "local",
      });
    } catch (e) {
      console.warn("[SignOut] Supabase signOut error:", e);
    }
  }

  const cookieStore = await cookies();
  cookieStore.delete("admin_last_active");
  cookieStore.delete("mock_user_role");
  cookieStore.delete("mock_user_email");
  cookieStore.delete("mock_user_name");
  cookieStore.delete("mock_incomplete_profile");

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("message", scope === "global" ? "signed_out_all" : "signed_out");

  return NextResponse.redirect(loginUrl);
}

