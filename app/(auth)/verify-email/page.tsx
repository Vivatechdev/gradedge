import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Verify Your Email",
  description: "Verify your GradEdge account email address.",
  path: "/verify-email",
  noIndex: true,
});

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Logo */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="w-3 h-3 bg-gold block" aria-hidden="true" />
            <span className="font-serif text-xl text-tone-heading font-semibold tracking-tight">
              GradEdge
            </span>
          </Link>
        </div>

        <div className="space-y-3">
          <div
            className="w-12 h-12 bg-success/10 border border-success/30 rounded-[4px] flex items-center justify-center mx-auto"
            aria-hidden="true"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-success"
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="type-h2 text-tone-heading">Check your email</h1>
          <p className="type-body text-tone-muted">
            We sent a verification link to your email address. Open it to
            activate your account.
          </p>
        </div>

        <div className="space-y-3">
          <p className="type-small text-tone-muted">
            Did not receive it? Check your spam folder. If it is not there,{" "}
            <Link
              href="/contact"
              className="text-navy font-medium hover:text-tone-heading transition-colors duration-150"
            >
              contact us
            </Link>
            .
          </p>

          <Button variant="secondary" href="/login" className="w-full">
            Back to sign in
          </Button>
        </div>
      </div>
    </div>
  );
}

