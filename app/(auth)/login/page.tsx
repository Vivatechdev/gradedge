import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Scholar Portal Sign In — GradEdge",
  description: "Sign in to access your dissertation projects, feedback archives, and consultations.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-tone-body">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <Logo variant="full" href="/" />
        </div>
        <h1 className="text-2xl font-serif text-tone-heading font-medium mt-2">
          Scholar Portal Sign In
        </h1>
        <p className="text-xs text-tone-muted">
          New to GradEdge?{" "}
          <Link href="/register" className="font-medium text-navy hover:text-gold transition-colors underline">
            Register your researcher account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-tone-rule sm:px-10 rounded-[2px] shadow-xs space-y-6">
          <form className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-tone-heading">
                Institutional Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="researcher@university.edu"
                className="block w-full border border-tone-rule bg-paper px-3 py-2.5 text-xs sm:text-sm text-tone-heading placeholder:text-tone-muted/60 focus:outline-2 focus:outline-navy rounded-[2px]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-tone-heading">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-tone-muted hover:text-navy underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
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
                Sign In to Dashboard &rarr;
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-tone-rule space-y-2 text-center text-xs text-tone-muted">
            <div className="flex items-center justify-center gap-1.5 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>TLS 1.3 256-bit encrypted research session</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              By signing in, you agree to the GradEdge Code of Conduct and strict academic integrity oath.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
