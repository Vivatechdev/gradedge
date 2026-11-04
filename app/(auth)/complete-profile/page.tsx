"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";

export default function CompleteProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/student";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studyLevel, setStudyLevel] = useState("masters");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [institution, setInstitution] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  // Silent timezone detection in browser
  const [timezone, setTimezone] = useState("UTC");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) {
        setTimezone(detected);
      }
    } catch {
      setTimezone("UTC");
    }

    // Fetch prefilled data from Google session
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push(`/login?returnTo=${encodeURIComponent("/complete-profile")}`);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.user) {
          setEmail(data.user.email || "");
          setFullName(data.user.full_name || "");
          if (data.profile) {
            if (data.profile.study_level) setStudyLevel(data.profile.study_level);
            if (data.profile.field_of_study) setFieldOfStudy(data.profile.field_of_study);
            if (data.profile.institution) setInstitution(data.profile.institution);
          }
        }
        setFetching(false);
      })
      .catch(() => {
        setFetching(false);
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!termsAccepted) {
      setErrorMessage("Please accept the Terms of Service and Academic Integrity Policy to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          study_level: studyLevel,
          field_of_study: fieldOfStudy,
          institution,
          timezone,
          terms_accepted: termsAccepted,
          terms_version: "1.0",
          marketing_opt_in: marketingOptIn,
          returnTo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to update profile. Please try again.");
        setLoading(false);
        return;
      }

      router.push(data.redirectTo || returnTo || "/student");
      router.refresh();
    } catch {
      setErrorMessage("Unable to connect to service. Please check your internet connection.");
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AuthShell
        title="One last step"
        description="Tell us about your research so we can match you with the right mentor."
      >
        <div className="py-12 text-center text-xs text-tone-muted font-sans">
          Loading researcher profile...
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="One last step"
      description="Tell us about your research so we can match you with the right mentor."
    >
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 bg-burgundy/10 border-l-2 border-burgundy text-xs text-tone-heading rounded-[4px] font-sans mb-5 leading-relaxed"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs sm:text-sm">
        {/* Full Name (prefilled from Google) */}
        <div className="space-y-1.5">
          <label
            htmlFor="full_name"
            className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
          >
            Full Name
          </label>
          <input
            id="full_name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="block w-full border border-[#E4DFD5] bg-paper px-3.5 py-2.5 text-tone-heading rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
          />
        </div>

        {/* Email (read-only from Google) */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-tone-muted"
          >
            Email (Verified by Google)
          </label>
          <input
            id="email"
            type="email"
            readOnly
            disabled
            value={email}
            className="block w-full border border-[#E4DFD5] bg-cream/40 px-3.5 py-2.5 text-tone-muted rounded-[4px] cursor-not-allowed"
          />
        </div>

        {/* Study Level & Field of Study */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <label
              htmlFor="study_level"
              className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
            >
              Study Level
            </label>
            <select
              id="study_level"
              value={studyLevel}
              onChange={(e) => setStudyLevel(e.target.value)}
              className="block w-full border border-[#E4DFD5] bg-paper px-3.5 py-2.5 text-tone-heading rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
            >
              <option value="undergraduate">Undergraduate</option>
              <option value="masters">Masters</option>
              <option value="phd">PhD or doctoral</option>
              <option value="researcher">Researcher or other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="field_of_study"
              className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
            >
              Field of Study
            </label>
            <input
              id="field_of_study"
              type="text"
              required
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              className="block w-full border border-[#E4DFD5] bg-paper px-3.5 py-2.5 text-tone-heading rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
            />
          </div>
        </div>

        {/* Institution */}
        <div className="space-y-1.5">
          <label
            htmlFor="institution"
            className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
          >
            Institution
          </label>
          <input
            id="institution"
            type="text"
            required
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="block w-full border border-[#E4DFD5] bg-paper px-3.5 py-2.5 text-tone-heading rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
          />
        </div>

        {/* Checkbox 1: Terms & Academic Integrity Policy (Required) */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 rounded-[2px] border-[#E4DFD5] text-navy focus:ring-gold focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-xs text-tone-body leading-relaxed">
              I agree to the{" "}
              <Link
                href="/legal/terms"
                target="_blank"
                className="text-navy hover:text-gold underline"
              >
                Terms of Service
              </Link>{" "}
              and the{" "}
              <Link
                href="/legal/academic-integrity"
                target="_blank"
                className="text-navy hover:text-gold underline"
              >
                Academic Integrity Policy
              </Link>
              .
            </span>
          </label>
        </div>

        {/* Checkbox 2: Marketing Opt-in (Separate & Unchecked) */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="mt-1 w-4 h-4 rounded-[2px] border-[#E4DFD5] text-navy focus:ring-gold focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-xs text-tone-muted leading-relaxed">
              Send me occasional research updates and resources.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-deep text-navy font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-[4px] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Saving profile..." : "Complete Profile & Continue"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
