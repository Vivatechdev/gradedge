"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { Button } from "@/components/ui/button";

function NewsletterUnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    async function unsubscribe() {
      if (token) {
        try {
          await fetch(`/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`);
        } catch {
          // Graceful fallback
        }
      }
    }
    unsubscribe();
  }, [token]);

  return (
    <div className="site-container py-16 md:py-24 max-w-xl text-center space-y-6">
      <div className="w-4 h-4 bg-ink-soft mx-auto" aria-hidden="true" />

      <div className="space-y-2">
        <h1 className="type-h2 text-tone-heading">You have been unsubscribed</h1>
        <p className="type-body text-tone-muted leading-relaxed">
          Your email address has been removed from our dispatch list. You will receive no further emails.
        </p>
      </div>

      <div className="pt-4">
        <Button variant="secondary" href="/">
          Return to Homepage
        </Button>
      </div>
    </div>
  );
}

export default function NewsletterUnsubscribePage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Unsubscribe" }]} />
      <Suspense fallback={<div className="p-12 text-center text-tone-muted">Processing unsubscribe request...</div>}>
        <NewsletterUnsubscribeContent />
      </Suspense>
    </>
  );
}

