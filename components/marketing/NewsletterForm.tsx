"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Subscription failed. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-success/10 border border-success/30 p-4 text-sm text-success rounded-[2px]">
        Thank you. Please check your inbox to confirm your subscription.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your academic email address"
          className="flex-1 border border-tone-rule bg-white px-3 py-2 text-sm text-tone-body rounded-[2px] focus:outline-2 focus:outline-navy"
          aria-label="Email address"
        />
        <Button type="submit" variant="primary" size="md" isLoading={status === "loading"}>
          Subscribe
        </Button>
      </div>
      {status === "error" && (
        <p className="type-small text-error mt-2">{errorMsg}</p>
      )}
    </form>
  );
}

