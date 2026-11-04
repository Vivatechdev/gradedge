import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Mentor Portal — GradEdge",
  description: "Faculty and doctoral mentor workspace.",
  path: "/mentor",
  noIndex: true,
});

export default function MentorPortalPage() {
  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 text-tone-body">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-6">
        <div className="flex justify-center">
          <Logo variant="full" href="/" />
        </div>

        <div className="bg-white border border-tone-rule p-8 sm:p-10 rounded-[2px] shadow-xs space-y-5">
          <div className="inline-block px-3 py-1 bg-cream border border-tone-rule text-[11px] font-sans uppercase tracking-widest text-tone-muted font-semibold rounded-[2px]">
            Faculty Workspace
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl text-tone-heading font-medium">
            Mentor area arrives soon
          </h1>

          <p className="type-body text-tone-body leading-relaxed max-w-md mx-auto">
            The dedicated faculty portal is undergoing final testing. Your assigned dissertation chapters, student line-reviews, and consultation schedules will be managed directly from this workspace.
          </p>

          <div className="pt-4 border-t border-tone-rule flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="secondary" href="/" size="md">
              Return to Homepage
            </Button>
            <form action="/api/auth/signout" method="POST">
              <Button variant="link" type="submit" size="md">
                Sign Out
              </Button>
            </form>
          </div>
        </div>

        <p className="type-micro text-tone-muted">
          Need immediate support with an active review cycle? Contact{" "}
          <a
            href="mailto:support@gradedge.com"
            className="text-navy hover:text-gold transition-colors underline"
          >
            support@gradedge.com
          </a>
        </p>
      </div>
    </div>
  );
}
