import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = ResetPasswordSchema.safeParse(json);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid password update.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { password } = result.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to update password. Your reset link may have expired." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your password has been securely updated. You can now sign in.",
      redirectTo: "/login?message=password_updated",
    });
  } catch (error: any) {
    console.error("[Reset Password Error]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while resetting your password." },
      { status: 500 }
    );
  }
}
