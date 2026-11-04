"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const COMMON_TIMEZONES = [
  "Africa/Lagos",
  "Africa/Johannesburg",
  "Africa/Nairobi",
  "Africa/Cairo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "UTC",
];

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [studyLevel, setStudyLevel] = useState("masters");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-detect browser timezone on mount
  useEffect(() => {
    try {
      const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detectedTz) {
        setTimezone(detectedTz);
      }
    } catch {
      setTimezone("UTC");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!termsAccepted) {
      setErrorMessage("Please accept the Terms of Service and Academic Integrity Policy to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          study_level: studyLevel,
          institution,
          field_of_study: fieldOfStudy,
          timezone,
          terms_accepted: termsAccepted,
          marketing_opt_in: marketingOptIn,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect to verification or student portal
      router.push(data.redirectTo || "/verify-email");
    } catch {
      setErrorMessage("Unable to connect to registration service. Please check your internet connection.");
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      honestLine="We do not write your thesis. We teach you how to write and defend it."
      subtext="Join researchers worldwide who finish on schedule with expert feedback and ethical developmental coaching."
      title="Create Researcher Account"
      subtitle={
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-navy hover:text-gold transition-colors underline font-medium"
          >
            Sign in to your workspace
          </Link>
        </p>
      }
    >
      {/* Error alert */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 bg-burgundy/10 border-l-2 border-burgundy text-xs text-tone-heading rounded-[1px] flex items-start gap-2.5 font-sans mb-5"
        >
          <AlertCircle className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Google OAuth Quick Start */}
      <GoogleSignInButton label="Sign up with Google" />

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-tone-rule" />
        <span className="text-[11px] font-sans uppercase tracking-widest text-tone-muted">
          or register with institutional email
        </span>
        <div className="flex-1 h-px bg-tone-rule" />
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs sm:text-sm">
        {/* Full Name */}
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
            placeholder="e.g. Dr. Jane Doe or Alex Smith"
            className="block w-full border border-tone-rule bg-paper px-3.5 py-2.5 text-tone-heading placeholder:text-tone-muted/60 focus:outline-2 focus:outline-navy rounded-[2px]"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
          >
            Academic or Personal Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="scholar@university.edu"
            className="block w-full border border-tone-rule bg-paper px-3.5 py-2.5 text-tone-heading placeholder:text-tone-muted/60 focus:outline-2 focus:outline-navy rounded-[2px]"
          />
        </div>

        {/* Password & Password Strength Meter */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full border border-tone-rule bg-paper px-3.5 py-2.5 pr-10 text-tone-heading placeholder:text-tone-muted/60 focus:outline-2 focus:outline-navy rounded-[2px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-tone-muted hover:text-tone-heading p-1 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Two-Column: Study Level & Institution */}
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
              className="block w-full border border-tone-rule bg-paper px-3.5 py-2.5 text-tone-heading focus:outline-2 focus:outline-navy rounded-[2px]"
            >
              <option value="undergraduate">Undergraduate</option>
              <option value="masters">Master&apos;s Candidate</option>
              <option value="phd">Doctoral / PhD Scholar</option>
              <option value="researcher">Academic Researcher / Postdoc</option>
              <option value="other">Other Postgraduate</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="institution"
              className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
            >
              University / Institution
            </label>
            <input
              id="institution"
              type="text"
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. University of Cambridge"
              className="block w-full border border-tone-rule bg-paper px-3.5 py-2.5 text-tone-heading placeholder:text-tone-muted/60 focus:outline-2 focus:outline-navy rounded-[2px]"
            />
          </div>
        </div>

        {/* Two-Column: Field of Study & Timezone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="field_of_study"
              className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
            >
              Field of Study / Discipline
            </label>
            <input
              id="field_of_study"
              type="text"
              required
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder="e.g. Epidemiology, Economics"
              className="block w-full border border-tone-rule bg-paper px-3.5 py-2.5 text-tone-heading placeholder:text-tone-muted/60 focus:outline-2 focus:outline-navy rounded-[2px]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="timezone"
              className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
            >
              Primary Timezone
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="block w-full border border-tone-rule bg-paper px-3.5 py-2.5 text-tone-heading focus:outline-2 focus:outline-navy rounded-[2px]"
            >
              {/* If detected timezone is not in common list, prepend it */}
              {!COMMON_TIMEZONES.includes(timezone) && (
                <option value={timezone}>{timezone} (Detected)</option>
              )}
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Checkbox 1: Terms & Academic Integrity Policy (Required) */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 rounded-[2px] border-tone-rule text-navy focus:ring-gold focus:ring-offset-0 cursor-pointer"
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
              , affirming that GradEdge is a non-ghostwriting developmental coaching service.
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
              className="mt-1 w-4 h-4 rounded-[2px] border-tone-rule text-navy focus:ring-gold focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-xs text-tone-muted leading-relaxed">
              Send me occasional research briefings, methodology essays, and writing advice (never spam, unsubscribe anytime).
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={loading}
            className="w-full text-xs font-semibold py-2.5"
          >
            {loading ? "Creating your workspace..." : "Create Researcher Account \u2192"}
          </Button>
        </div>
      </form>
    </AuthSplitLayout>
  );
}
