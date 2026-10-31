"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log error in production
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-paper flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-4 h-4 bg-error mx-auto" aria-hidden="true" />
        <p className="type-micro text-error font-semibold">500 Server Error</p>
        <h1 className="type-h2 text-tone-heading">Something went wrong.</h1>
        <p className="type-body text-tone-muted leading-relaxed">
          An unexpected error occurred while processing your request. Try reloading the page, or contact our team if the issue persists.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <Button variant="primary" onClick={() => reset()}>
            Try again
          </Button>
          <Button variant="secondary" href="/contact">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}

