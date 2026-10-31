import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Reset Password — GradEdge",
  description: "Reset instructions for your GradEdge researcher account.",
  path: "/reset",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-tone-body">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <Logo variant="full" href="/" />
        </div>
        <h1 className="text-2xl font-serif text-tone-heading font-medium mt-2">
          Reset Your Password
        </h1>
        <p className="text-xs text-tone-muted">
          Enter your registered institutional or primary email address to receive reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-tone-rule sm:px-10 rounded-[2px] shadow-xs space-y-6">
          <form className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-tone-heading">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="researcher@university.edu"
                className="block w-full border border-tone-rule bg-paper px-3 py-2.5 text-xs sm:text-sm text-tone-heading placeholder:text-tone-muted/60 focus:outline-2 focus:outline-navy rounded-[2px]"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full text-xs font-semibold"
              >
                Send Reset Instructions &rarr;
              </Button>
            </div>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-tone-muted hover:text-navy underline">
                Return to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
