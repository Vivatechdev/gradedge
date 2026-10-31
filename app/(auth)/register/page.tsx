import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Create Researcher Account — GradEdge",
  description: "Register to manage doctoral projects, consultation schedules, and developmental feedback.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-tone-body">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <Logo variant="full" href="/" />
        </div>
        <h1 className="text-2xl font-serif text-tone-heading font-medium mt-2">
          Create Your Researcher Account
        </h1>
        <p className="text-xs text-tone-muted">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-navy hover:text-gold transition-colors underline">
            Sign in to existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-tone-rule sm:px-10 rounded-[2px] shadow-xs space-y-6">
          <form className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="full_name" className="block text-xs font-semibold uppercase tracking-wider text-tone-heading">
                Full Name *
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                placeholder="e.g. Jane Doe"
                className="block w-full border border-tone-rule bg-paper px-3 py-2.5 text-xs sm:text-sm text-tone-heading placeholder:text-tone-muted/60 focus:outline-2 focus:outline-navy rounded-[2px]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-tone-heading">
                Institutional or Primary Email *
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

            <div className="space-y-1">
              <label htmlFor="study_level" className="block text-xs font-semibold uppercase tracking-wider text-tone-heading">
                Academic Degree Level *
              </label>
              <select
                id="study_level"
                name="study_level"
                className="block w-full border border-tone-rule bg-paper px-3 py-2.5 text-xs sm:text-sm text-tone-heading focus:outline-2 focus:outline-navy rounded-[2px]"
              >
                <option value="phd">PhD / Doctoral Candidate</option>
                <option value="masters">Masters / MPhil Researcher</option>
                <option value="undergraduate">Undergraduate Honours</option>
                <option value="postdoc">Postdoctoral / Early Career Faculty</option>
                <option value="other">Independent Researcher</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-tone-heading">
                Create Secure Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="At least 8 characters"
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
                Complete Registration &rarr;
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-tone-rule space-y-2 text-center text-xs text-tone-muted">
            <div className="flex items-center justify-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Strict Academic Integrity Pledge Enforced</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              By creating an account, you affirm that all work submitted for mentoring review is your own and that you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
