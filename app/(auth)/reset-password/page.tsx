"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please ensure both fields are identical.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
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
    <AuthSplitLayout
      honestLine="A secure password protects your intellectual property."
      subtext="Choose a strong, memorable passphrase for your researcher portal and dissertation deliverables."
      title="Set New Password"
      subtitle={<p>Enter and confirm your new account password below.</p>}
    >
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 bg-burgundy/10 border-l-2 border-burgundy text-xs text-tone-heading rounded-[1px] flex items-start gap-2.5 font-sans mb-5"
        >
          <AlertCircle className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs sm:text-sm">
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
          >
            New Password
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

        <div className="space-y-1.5">
          <label
            htmlFor="confirm_password"
            className="block text-xs font-semibold uppercase tracking-wider text-tone-heading"
          >
            Confirm New Password
          </label>
          <input
            id="confirm_password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full border border-tone-rule bg-paper px-3.5 py-2.5 text-tone-heading placeholder:text-tone-muted/60 focus:outline-2 focus:outline-navy rounded-[2px]"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={loading}
            className="w-full text-xs font-semibold py-2.5"
          >
            {loading ? "Updating password..." : "Update Password & Sign In \u2192"}
          </Button>
        </div>
      </form>
    </AuthSplitLayout>
  );
}
