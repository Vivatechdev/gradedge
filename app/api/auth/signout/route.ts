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

  const supabase = await createClient();

  // If scope is global, invalidates all refresh tokens across all devices
  await supabase.auth.signOut({
    scope: scope === "global" ? "global" : "local",
  });

  const cookieStore = await cookies();
  cookieStore.delete("admin_last_active");

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("message", scope === "global" ? "signed_out_all" : "signed_out");

  return NextResponse.redirect(loginUrl);
}

