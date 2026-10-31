"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";

function NewsletterConfirmContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function confirmSubscription() {
      if (token) {
        try {
          await fetch(`/api/newsletter/confirm?token=${encodeURIComponent(token)}`);
        } catch {
          // Graceful fallback
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    confirmSubscription();
  }, [token]);

  if (loading) {
    return (
      <div className="site-container py-16 md:py-24 max-w-xl text-center space-y-4">
        <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="type-body text-tone-muted">Confirming your subscription...</p>
      </div>
    );
  }

  return (
    <div className="site-container py-16 md:py-24 max-w-xl text-center space-y-6">
      <div className="w-12 h-12 bg-success/10 border border-success/30 rounded-[2px] flex items-center justify-center mx-auto text-success font-bold text-xl">
        &check;
      </div>

      <div className="space-y-2">
        <h1 className="type-h2 text-tone-heading">Subscription Confirmed</h1>
        <p className="type-body text-tone-muted leading-relaxed">
          Thank you. You have been added to The Research Briefing mailing list. You will receive occasional methodological guides and writing tutorials.
        </p>
      </div>

      <div className="pt-4">
        <Button variant="primary" href="/blog">
          Explore Research Articles
        </Button>
      </div>
    </div>
  );
}

export default function NewsletterConfirmPage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Subscription Confirmed" }]} />
      <Suspense fallback={<div className="p-12 text-center text-tone-muted">Confirming subscription...</div>}>
        <NewsletterConfirmContent />
      </Suspense>
    </>
  );
}

