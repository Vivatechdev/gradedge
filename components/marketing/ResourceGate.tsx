"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export function ResourceGate({
  resourceTitle,
  downloadUrl,
}: {
  resourceTitle: string;
  downloadUrl?: string;
}) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError("Please confirm consent to receive updates.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setUnlocked(true);
    } catch {
      setError("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (unlocked) {
    return (
      <div className="bg-cream border border-tone-rule p-6 space-y-4 rounded-[2px]">
        <h4 className="font-serif text-lg text-tone-heading font-semibold">
          Access Granted: {resourceTitle}
        </h4>
        <p className="type-body text-tone-muted">
          Thank you for providing your academic email. You can download your copy below:
        </p>
        {downloadUrl ? (
          <a
            href={downloadUrl}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-gold text-white font-medium rounded-[2px] hover:bg-[#B38332] transition-colors"
            download
          >
            Download Resource File
          </a>
        ) : (
          <div className="p-3 bg-paper border border-tone-rule text-sm text-tone-muted">
            Direct download link will be dispatched to <strong>{email}</strong> momentarily.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-paper border border-tone-rule p-6 space-y-4 rounded-[2px]">
      <h4 className="font-serif text-lg text-tone-heading font-medium">
        Download: {resourceTitle}
      </h4>
      <p className="type-small text-tone-muted">
        Enter your academic email address below to download this template directly.
      </p>

      <form onSubmit={handleUnlock} className="space-y-4">
        <div>
          <label htmlFor={`gate-email-${resourceTitle}`} className="sr-only">
            Email address
          </label>
          <input
            id={`gate-email-${resourceTitle}`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@university.edu"
            className="w-full border border-tone-rule bg-white px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
          />
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id={`gate-consent-${resourceTitle}`}
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-3.5 w-3.5 rounded-[2px] border-tone-rule text-navy focus:ring-navy"
          />
          <label htmlFor={`gate-consent-${resourceTitle}`} className="text-xs text-tone-muted leading-tight">
            I agree to receive occasional academic research guidance from GradEdge. You can unsubscribe anytime.
          </label>
        </div>

        {error && <p className="type-small text-error">{error}</p>}

        <Button type="submit" variant="primary" size="md" isLoading={loading}>
          Access Template
        </Button>
      </form>
    </div>
  );
}

