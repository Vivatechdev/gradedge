"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageBreadcrumb } from "@/components/marketing/page-components";

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const [statusMessage, setStatusMessage] = useState("Connecting to settlement network...");

  useEffect(() => {
    if (!reference) {
      router.replace("/checkout/failed?reason=missing_reference");
      return;
    }

    let isMounted = true;
    const safeRef = reference || "";

    async function verify() {
      try {
        setStatusMessage("Confirming authorization with banking network...");
        const res = await fetch(`/api/payments/verify?reference=${encodeURIComponent(safeRef)}`);
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.success) {
          setStatusMessage("Payment authorized. Finalizing your student portal...");
          router.replace(
            `/checkout/success?reference=${encodeURIComponent(safeRef)}&invoice=${encodeURIComponent(
              data.invoiceNumber || ""
            )}`
          );
        } else {
          router.replace(
            `/checkout/failed?reference=${encodeURIComponent(safeRef)}&reason=${encodeURIComponent(
              data.error || data.status || "Card transaction was declined."
            )}`
          );
        }
      } catch (err: any) {
        if (!isMounted) return;
        router.replace(
          `/checkout/failed?reference=${encodeURIComponent(safeRef)}&reason=${encodeURIComponent(
            err.message || "Network timeout during verification."
          )}`
        );
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [reference, router]);

  return (
    <div className="site-container py-16 md:py-24 max-w-xl text-center space-y-6">
      <div className="w-10 h-10 border-2 border-navy border-t-gold rounded-full animate-spin mx-auto" />

      <div className="space-y-2">
        <h1 className="font-serif text-2xl text-tone-heading font-medium">
          Verifying Transaction
        </h1>
        <p className="text-xs text-tone-muted leading-relaxed">
          {statusMessage}
        </p>
      </div>

      <div className="p-4 bg-white border border-tone-rule rounded-[2px] text-xs text-tone-muted max-w-sm mx-auto">
        Please keep this window open while we obtain cryptographic verification and generate your official tax invoice.
      </div>
    </div>
  );
}

export default function CheckoutVerifyPage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Payment Verification" }]} />
      <Suspense
        fallback={
          <div className="site-container py-24 text-center">
            <div className="w-8 h-8 border-2 border-navy border-t-gold rounded-full animate-spin mx-auto" />
          </div>
        }
      >
        <VerificationContent />
      </Suspense>
    </>
  );
}
