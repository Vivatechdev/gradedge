"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password?: string;
  className?: string;
}

export function evaluatePasswordStrength(password: string = ""): {
  score: number;
  label: string;
  feedback: string;
  colorClass: string;
} {
  if (!password) {
    return {
      score: 0,
      label: "",
      feedback: "Minimum 8 characters with at least one letter and one number.",
      colorClass: "bg-tone-rule",
    };
  }

  let points = 0;

  // Length checks
  if (password.length >= 8) points += 1;
  if (password.length >= 12) points += 1;

  // Character diversity
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const diversityCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
  if (diversityCount >= 3) points += 1;
  if (diversityCount === 4 && password.length >= 10) points += 1;

  const score = Math.min(4, points);

  switch (score) {
    case 1:
      return {
        score: 1,
        label: "Weak",
        feedback: "Add numbers or uppercase letters for better security.",
        colorClass: "bg-error",
      };
    case 2:
      return {
        score: 2,
        label: "Fair",
        feedback: "Good start. Add a special character or make it longer.",
        colorClass: "bg-gold",
      };
    case 3:
      return {
        score: 3,
        label: "Good",
        feedback: "Solid password that protects your drafts well.",
        colorClass: "bg-forest",
      };
    case 4:
      return {
        score: 4,
        label: "Strong",
        feedback: "Excellent research-grade password protection.",
        colorClass: "bg-forest",
      };
    default:
      return {
        score: 0,
        label: "Too short",
        feedback: "Must be at least 8 characters long.",
        colorClass: "bg-error",
      };
  }
}

export function PasswordStrengthMeter({
  password = "",
  className,
}: PasswordStrengthMeterProps) {
  const { score, label, feedback, colorClass } = evaluatePasswordStrength(password);

  if (!password) {
    return (
      <p className="text-[11px] text-tone-muted mt-1 leading-normal font-sans">
        {feedback}
      </p>
    );
  }

  return (
    <div className={cn("space-y-1.5 mt-2", className)}>
      <div className="flex items-center justify-between text-[11px] font-sans">
        <span className="text-tone-muted">Password strength:</span>
        <span
          className={cn(
            "font-medium",
            score <= 1 && "text-error",
            score === 2 && "text-gold",
            score >= 3 && "text-forest"
          )}
        >
          {label}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1 w-full bg-cream rounded-full overflow-hidden">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={cn(
              "h-full transition-all duration-200 rounded-full",
              step <= score ? colorClass : "bg-tone-rule/60"
            )}
          />
        ))}
      </div>

      <p className="text-[11px] text-tone-muted leading-normal font-sans">
        {feedback}
      </p>
    </div>
  );
}
