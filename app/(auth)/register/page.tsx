"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [studyLevel, setStudyLevel] = useState("masters");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [institution, setInstitution] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  // Silent timezone detection in browser (no UI input)
  const [timezone, setTimezone] = useState("UTC");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) {
        setTimezone(detected);
      }
    } catch {
      setTimezone("UTC");
    }
  }, []);

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (password && val && password !== val) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (confirmPassword && val !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 10) {
      setErrorMessage("Password must be at least 10 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      setErrorMessage("Please ensure your passwords match.");
      return;
    }

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
          confirm_password: confirmPassword,
          study_level: studyLevel,
          field_of_study: fieldOfStudy,
          institution,
          timezone,
          terms_accepted: termsAccepted,
          terms_version: "1.0",
          marketing_opt_in: marketingOptIn,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      router.push(data.redirectTo || "/verify-email");
    } catch {
      setErrorMessage("Unable to connect to registration service. Please check your internet connection.");
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" activeTab="register">
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 bg-burgundy/10 border-l-2 border-burgundy text-xs text-tone-heading rounded-[4px] font-sans mb-5 leading-relaxed"
        >
          {errorMessage}
        </div>
      )}

      {/* Official Google Button */}
      <GoogleSignInButton label="Continue with Google" />

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-tone-rule" />
        <span className="text-[11px] font-sans uppercase tracking-widest text-tone-muted">
          or
        </span>
        <div className="flex-1 h-px bg-tone-rule" />
      </div>

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
            className="block w-full border border-[#E4DFD5] bg-paper px-3.5 py-2.5 text-tone-heading rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full border border-[#E4DFD5] bg-paper px-3.5 py-2.5 text-tone-heading rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-tone-muted hover:text-tone-heading font-medium transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="block w-full border border-[#E4DFD5] bg-paper px-3.5 py-2.5 text-tone-heading rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
          />
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="confirm_password"
              className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
            >
              Confirm Password
            </label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-xs text-tone-muted hover:text-tone-heading font-medium transition-colors"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            id="confirm_password"
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            className="block w-full border border-[#E4DFD5] bg-paper px-3.5 py-2.5 text-tone-heading rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
          />
          {confirmPasswordError && (
            <p className="text-[11px] text-error font-sans font-medium">
              {confirmPasswordError}
            </p>
          )}
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
              className="mt-1 w-4 h-4 rounded-[2px] border-tone-rule text-navy focus:ring-gold focus:ring-offset-0 cursor-pointer"
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
            {loading ? "Creating your account..." : "Create Account"}
          </button>
        </div>

        {/* Sign in link */}
        <div className="pt-4 border-t border-tone-rule text-center text-xs font-sans text-tone-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-navy hover:text-gold transition-colors underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
