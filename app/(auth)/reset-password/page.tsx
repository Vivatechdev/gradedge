"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

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
      setErrorMessage("Passwords do not match. Please ensure both fields are identical.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to update password. Your reset link may have expired.");
        setLoading(false);
        return;
      }

      router.push("/login?message=password_updated");
    } catch {
      setErrorMessage("Unable to connect to service. Please check your internet connection.");
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Set a new password">
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 bg-burgundy/10 border-l-2 border-burgundy text-xs text-tone-heading rounded-[4px] font-sans mb-5 leading-relaxed"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs sm:text-sm">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
            >
              New Password
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

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-deep text-navy font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-[4px] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Updating password..." : "Update Password"}
          </button>
        </div>

        <div className="pt-4 border-t border-tone-rule text-center text-xs font-sans text-tone-muted">
          <Link
            href="/login"
            className="text-navy hover:text-gold transition-colors underline font-medium"
          >
            Return to Sign In
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
