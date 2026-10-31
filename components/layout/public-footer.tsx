"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";

export function PublicFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <footer data-tone="navy-deep" className="tone-navy-deep bg-navy-deep text-tone-body border-t border-tone-rule pt-16 pb-12 mt-24">
      <div className="site-container">
        {/* Top Section: Honest Brand Statement and Logo */}
        <div className="border-b border-tone-rule pb-12 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-xl space-y-4">
            <Logo variant="full-white" href="/" />
            <p className="font-serif text-xl sm:text-2xl text-tone-heading leading-snug font-normal">
              &ldquo;GradEdge is a coaching and feedback service. The research and the writing stay
              yours.&rdquo;
            </p>
            <p className="text-xs text-tone-muted leading-relaxed max-w-lg">
              We provide structured dissertation mentoring, methodological guidance, and statistical
              audits for postgraduate researchers worldwide. We adhere strictly to university
              academic integrity standards.
            </p>
          </div>

          {/* Newsletter Signup (Double Opt-In) */}
          <div className="w-full md:w-80 bg-white/5 border border-tone-rule p-5 rounded-[2px]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-tone-heading">
              The Research Quarterly
            </h4>
            <p className="text-[11px] text-tone-muted mt-1 leading-normal">
              Occasional advice on methodology, statistical syntax, and thesis writing. No spam.
            </p>
            {subscribed ? (
              <p className="text-xs text-gold mt-3 font-medium">
                Please check your inbox to confirm your subscription.
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="mt-3 space-y-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="researcher@university.edu"
                  required
                  aria-label="Email address for newsletter"
                  className="w-full bg-[var(--tone-input-bg)] border border-[var(--tone-input-border)] text-[var(--tone-input-text)] placeholder:text-[var(--tone-input-placeholder)] text-xs px-3 py-2 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <Button variant="accent" size="sm" type="submit" className="w-full text-xs">
                  Subscribe (Double Opt-In)
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Four Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-tone-rule text-xs">
          {/* Column 1: Services */}
          <div>
            <h5 className="font-semibold uppercase tracking-wider text-gold mb-3">
              Services
            </h5>
            <ul className="space-y-2 text-tone-muted">
              <li>
                <Link href="/services/dissertation-support" className="hover:text-white transition-colors">
                  Dissertation Support
                </Link>
              </li>
              <li>
                <Link href="/services/data-analysis" className="hover:text-white transition-colors">
                  Data Analysis & Statistics
                </Link>
              </li>
              <li>
                <Link href="/services/editing-and-writing-quality" className="hover:text-white transition-colors">
                  Editing & Writing Quality
                </Link>
              </li>
              <li>
                <Link href="/services/publishing-and-career" className="hover:text-white transition-colors">
                  Publishing & Career Support
                </Link>
              </li>
              <li>
                <Link href="/services/coaching-and-training" className="hover:text-white transition-colors">
                  Coaching & Training
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/accelerator" className="text-white hover:text-gold font-medium transition-colors">
                  9-Month Accelerator &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Learn */}
          <div>
            <h5 className="font-semibold uppercase tracking-wider text-gold mb-3">
              Learn
            </h5>
            <ul className="space-y-2 text-tone-muted">
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Writing & Research Advice
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Templates & Audit Guides
                </Link>
              </li>
              <li>
                <Link href="/subjects" className="hover:text-white transition-colors">
                  Subject Areas & Disciplines
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/resources/glossary" className="hover:text-white transition-colors">
                  Academic Research Glossary
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h5 className="font-semibold uppercase tracking-wider text-gold mb-3">
              Company
            </h5>
            <ul className="space-y-2 text-tone-muted">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About GradEdge
                </Link>
              </li>
              <li>
                <Link href="/about/how-it-works" className="hover:text-white transition-colors">
                  How Mentoring Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing & Support Tiers
                </Link>
              </li>
              <li>
                <Link href="/institutions" className="hover:text-white transition-colors">
                  For Universities & Labs
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-white transition-colors">
                  Student Stories
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Our Advisory Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h5 className="font-semibold uppercase tracking-wider text-gold mb-3">
              Legal & Policies
            </h5>
            <ul className="space-y-2 text-tone-muted">
              <li>
                <Link href="/legal/academic-integrity" className="hover:text-white transition-colors">
                  Academic Integrity Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-white transition-colors">
                  Privacy & Data Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/refunds" className="hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-white transition-colors">
                  Cookie Preferences
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-white transition-colors">
                  Accessibility Statement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Plain Social Links, Sitemap */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-tone-muted gap-4 text-center md:text-left">
          <p>&copy; 2026 GradEdge Academic Solutions. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2 text-xs">
            <span className="text-tone-muted">Connect:</span>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://researchgate.net"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              ResearchGate
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              X / Twitter
            </a>
            <span className="text-tone-muted opacity-50 hidden sm:inline">|</span>
            <Link href="/sitemap" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

