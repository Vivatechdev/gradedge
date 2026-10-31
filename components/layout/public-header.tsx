"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const SERVICE_CATEGORIES = [
  {
    name: "Dissertation Support",
    href: "/services/dissertation-support",
    summary: "Dissertation & thesis mentoring, research formulation, literature review",
  },
  {
    name: "Data Analysis",
    href: "/services/data-analysis",
    summary: "SPSS, R, Python, Stata, NVivo, SmartPLS & structural equation modeling",
  },
  {
    name: "Editing & Writing Quality",
    href: "/services/editing-and-writing-quality",
    summary: "Academic editing, proofreading, referencing and similarity review",
  },
  {
    name: "Publishing & Career",
    href: "/services/publishing-and-career",
    summary: "Journal conversion, grant coaching, conference presentations",
  },
  {
    name: "Coaching & Training",
    href: "/services/coaching-and-training",
    summary: "One-on-one tutoring, institutional workshops, viva defense coaching",
  },
];

export function PublicHeader({
  isLoggedIn = false,
  userRole = "student",
}: {
  isLoggedIn?: boolean;
  userRole?: string;
}) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "The Accelerator", href: "/accelerator" },
    { label: "Pricing", href: "/pricing" },
    { label: "Subjects", href: "/subjects" },
    { label: "Resources", href: "/resources" },
    { label: "Blog", href: "/blog" },
  ];

  const dashboardHref = userRole === "admin" ? "/admin" : "/student";

  return (
    <>
      {/* Skip-to-content accessible link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-navy focus:text-white focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Sticky header (no blur, flat paper background, hairline bottom border) */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full bg-paper border-b border-tone-rule transition-all duration-150",
          isScrolled ? "py-2.5" : "py-3.5"
        )}
      >
        <div className="site-container flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo variant="full" href="/" />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 text-sm" aria-label="Main Navigation">
              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                <Link
                  href="/services"
                  className={cn(
                    "inline-flex items-center gap-1 py-1 text-tone-body hover:text-tone-heading transition-colors font-medium relative",
                    pathname.startsWith("/services") && "text-navy"
                  )}
                >
                  <span>Services</span>
                  <svg
                    className={cn(
                      "h-3.5 w-3.5 text-tone-muted transition-transform duration-150",
                      servicesDropdownOpen && "rotate-180"
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                  {pathname.startsWith("/services") && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold" />
                  )}
                </Link>

                {/* Services Dropdown Panel */}
                {servicesDropdownOpen && (
                  <div
                    className="absolute top-full -left-2 w-80 bg-white border border-tone-rule rounded-[2px] p-2 mt-1 z-50 divide-y divide-rule/60"
                    role="menu"
                  >
                    {SERVICE_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="block p-3 hover:bg-paper transition-colors rounded-[2px]"
                        role="menuitem"
                      >
                        <span className="block text-xs font-semibold text-tone-heading uppercase tracking-wider">
                          {cat.name}
                        </span>
                        <span className="block text-[11px] text-tone-muted mt-0.5 leading-snug">
                          {cat.summary}
                        </span>
                      </Link>
                    ))}
                    <div className="p-2 pt-3 text-right">
                      <Link
                        href="/services"
                        className="text-xs text-navy font-medium hover:underline inline-flex items-center gap-1"
                      >
                        View all 20 services &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "py-1 text-tone-body hover:text-tone-heading transition-colors font-medium relative",
                      isActive && "text-navy"
                    )}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center gap-5">
            {isLoggedIn ? (
              <Link
                href={dashboardHref}
                className="text-xs font-medium uppercase tracking-wider text-tone-link hover:text-tone-heading underline decoration-gold underline-offset-4"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs font-medium uppercase tracking-wider text-tone-muted hover:text-tone-heading transition-colors"
              >
                Log in
              </Link>
            )}

            <Button href="/booking" variant="accent" size="sm">
              Book a free call
            </Button>
          </div>

          {/* Mobile Menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="lg:hidden inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-navy border border-tone-rule px-3 py-1.5 rounded-[2px] bg-white hover:bg-cream"
          >
            <span>Menu</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Full-screen Mobile Menu Sheet with booking button pinned at bottom */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-paper flex flex-col justify-between overflow-y-auto">
          {/* Header inside mobile menu */}
          <div className="border-b border-tone-rule py-4 px-6 flex items-center justify-between">
            <Logo variant="full" href="/" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Menu"
              className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-tone-muted hover:text-tone-heading border border-tone-rule px-3 py-1.5 rounded-[2px] bg-white"
            >
              <span>Close</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links list */}
          <div className="px-6 py-6 flex-1 space-y-5">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-tone-muted font-semibold block mb-2">
                Services & Focus Areas
              </span>
              <div className="space-y-2 border-l border-tone-rule pl-3">
                {SERVICE_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="block text-sm text-tone-heading font-medium hover:text-tone-heading"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-tone-rule space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-tone-muted font-semibold block mb-1">
                Explore GradEdge
              </span>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block font-serif text-lg text-tone-heading hover:text-tone-heading"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-tone-rule">
              {isLoggedIn ? (
                <Link
                  href={dashboardHref}
                  className="block text-sm font-semibold uppercase tracking-wider text-navy"
                >
                  Go to Dashboard &rarr;
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block text-sm font-semibold uppercase tracking-wider text-navy"
                >
                  Student & Researcher Login &rarr;
                </Link>
              )}
            </div>
          </div>

          {/* Bottom pinned booking button */}
          <div className="p-6 border-t border-tone-rule bg-cream">
            <Button href="/booking" variant="accent" size="lg" className="w-full text-center">
              Book a free 20-minute call
            </Button>
            <p className="text-[11px] text-tone-muted text-center mt-2.5">
              Zero obligation. Strictly confidential academic advisory.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
