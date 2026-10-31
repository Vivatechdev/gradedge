"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: "left" | "right";
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
  className,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-navy-deep/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed inset-y-0 flex max-w-full",
          position === "right" ? "right-0" : "left-0"
        )}
      >
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          className={cn(
            "w-screen max-w-md bg-paper border-tone-rule p-6 flex flex-col justify-between overflow-y-auto",
            position === "right" ? "border-l" : "border-r",
            className
          )}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-tone-rule mb-6">
              {title ? (
                <h2 className="font-serif text-xl font-medium text-tone-heading">{title}</h2>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="text-tone-muted hover:text-tone-heading p-1 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-tone-body">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

