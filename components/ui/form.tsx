"use client";

import React, { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

// --- FORM LAYOUT HELPERS ---

export function FormField({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-1.5", className)}>{children}</div>;
}

export function FormRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>{children}</div>;
}

export function FormGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("grid grid-cols-1 md:grid-cols-12 gap-4", className)}>{children}</div>;
}

export function FormGroup({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("border-t border-tone-rule pt-6 mt-6 first:mt-0 first:pt-0 first:border-0", className)}>
      {title && (
        <legend className="font-serif text-lg text-tone-heading font-medium mb-1">
          {title}
        </legend>
      )}
      {description && <p className="text-xs text-tone-muted mb-4">{description}</p>}
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

// --- INPUT COMPONENT ---

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className, id, required, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <FormField>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-tone-body"
          >
            {label} {required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            "block w-full bg-[var(--tone-input-bg,#FFFFFF)] text-[var(--tone-input-text,#2B2B2B)] text-sm px-3.5 py-2.5 border rounded-[2px] transition-colors duration-150",
            "placeholder:text-[var(--tone-input-placeholder,#555555)] focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy",
            error ? "border-error focus:border-error focus:ring-error" : "border-[var(--tone-input-border,#E4DFD5)]",
            className
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-xs text-error mt-1 flex items-center gap-1 font-medium">
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-tone-muted mt-1">
            {helperText}
          </p>
        ) : null}
      </FormField>
    );
  }
);
Input.displayName = "Input";

// --- TEXTAREA COMPONENT ---

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className, id, required, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <FormField>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-tone-body"
          >
            {label} {required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            "block w-full bg-[var(--tone-input-bg,#FFFFFF)] text-[var(--tone-input-text,#2B2B2B)] text-sm px-3.5 py-2.5 border rounded-[2px] transition-colors duration-150",
            "placeholder:text-[var(--tone-input-placeholder,#555555)] focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy resize-y",
            error ? "border-error focus:border-error focus:ring-error" : "border-[var(--tone-input-border,#E4DFD5)]",
            className
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-xs text-error mt-1 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-tone-muted mt-1">
            {helperText}
          </p>
        ) : null}
      </FormField>
    );
  }
);
Textarea.displayName = "Textarea";

// --- SELECT COMPONENT ---

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, className, id, required, children, options, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <FormField>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-tone-body"
          >
            {label} {required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={Boolean(error)}
            className={cn(
              "block w-full appearance-none bg-[var(--tone-input-bg,#FFFFFF)] text-[var(--tone-input-text,#2B2B2B)] text-sm px-3.5 py-2.5 pr-10 border rounded-[2px] transition-colors duration-150",
              "focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy",
              error ? "border-error focus:border-error focus:ring-error" : "border-[var(--tone-input-border,#E4DFD5)]",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-tone-muted">
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error ? (
          <p className="text-xs text-error mt-1 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-tone-muted mt-1">{helperText}</p>
        ) : null}
      </FormField>
    );
  }
);
Select.displayName = "Select";

// --- CHECKBOX COMPONENT ---

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  helperText?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <div className={cn("flex items-start gap-3", className)}>
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className="h-4 w-4 mt-0.5 border border-tone-rule rounded-[2px] text-navy focus:ring-navy focus:ring-offset-0 cursor-pointer accent-navy"
          {...props}
        />
        <div className="text-sm">
          <label htmlFor={checkboxId} className="font-normal text-tone-body cursor-pointer select-none">
            {label}
          </label>
          {helperText && <p className="text-xs text-tone-muted mt-0.5">{helperText}</p>}
          {error && <p className="text-xs text-error mt-0.5 font-medium">{error}</p>}
        </div>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

// --- RADIO COMPONENT ---

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  helperText?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, helperText, className, id, ...props }, ref) => {
    const generatedId = useId();
    const radioId = id || generatedId;

    return (
      <div className={cn("flex items-start gap-3", className)}>
        <input
          ref={ref}
          id={radioId}
          type="radio"
          className="h-4 w-4 mt-0.5 border border-tone-rule text-navy focus:ring-navy cursor-pointer accent-navy"
          {...props}
        />
        <div className="text-sm">
          <label htmlFor={radioId} className="font-normal text-tone-body cursor-pointer select-none">
            {label}
          </label>
          {helperText && <p className="text-xs text-tone-muted mt-0.5">{helperText}</p>}
        </div>
      </div>
    );
  }
);
Radio.displayName = "Radio";

// --- TOGGLE / SWITCH COMPONENT ---

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  helperText,
  disabled = false,
  className,
  id,
}: ToggleProps) {
  const generatedId = useId();
  const toggleId = id || generatedId;

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      {(label || helperText) && (
        <div>
          {label && (
            <label
              htmlFor={toggleId}
              className="text-sm font-medium text-tone-body cursor-pointer select-none block"
            >
              {label}
            </label>
          )}
          {helperText && <p className="text-xs text-tone-muted mt-0.5">{helperText}</p>}
        </div>
      )}
      <button
        id={toggleId}
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-[2px] border border-tone-rule transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy",
          checked ? "bg-navy border-navy" : "bg-paper",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-[1px] bg-white shadow-none transition duration-150 ease-in-out mt-[1px] ml-[1px]",
            checked ? "translate-x-4 bg-white" : "translate-x-0 bg-ink-soft/40"
          )}
        />
      </button>
    </div>
  );
}

