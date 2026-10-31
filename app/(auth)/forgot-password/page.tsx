import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Forgot Password",
  description: "Reset your GradEdge account password.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="w-3 h-3 bg-gold block" aria-hidden="true" />
            <span className="font-serif text-xl text-tone-heading font-semibold tracking-tight">
              GradEdge
            </span>
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="type-h2 text-tone-heading">Reset your password</h1>
          <p className="type-body text-tone-muted">
            Enter your email address and we will send you a link to reset your
            password.
          </p>
        </div>

        {/* Stub form — wired up in Stage 5 */}
        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="type-small text-tone-body font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border border-tone-rule bg-white px-3 py-2.5 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy placeholder:text-tone-muted/60"
              placeholder="you@university.edu"
            />
          </div>

          <Button variant="primary" size="lg" className="w-full">
            {/* TODO Stage 5: wire up Supabase resetPasswordForEmail */}
            Send reset link
          </Button>
        </form>

        <p className="type-small text-tone-muted text-center">
          Remembered it?{" "}
          <Link
            href="/login"
            className="text-navy font-medium hover:text-tone-heading transition-colors duration-150 border-b border-navy/30 hover:border-navy pb-0.5"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

