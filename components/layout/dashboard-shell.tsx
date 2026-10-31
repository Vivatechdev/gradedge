"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  CalendarCheck,
  CreditCard,
  MessageSquare,
  FileText,
  Settings,
  Bell,
  LogOut,
  GraduationCap,
  Users,
  ShieldCheck,
  BookOpen,
  MoreHorizontal,
  X,
} from "lucide-react";

export interface DashboardNavSubItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface DashboardShellProps {
  children: React.ReactNode;
  role?: "student" | "admin";
  user?: {
    name: string;
    email: string;
    institution?: string;
  };
  title?: string;
}

export function DashboardShell({
  children,
  role = "student",
  user = {
    name: "Freedom Sola",
    email: "freedom.sola@university.edu",
    institution: "Postgraduate Researcher",
  },
  title = "Overview",
}: DashboardShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  // Student Navigation Items
  const studentNav: DashboardNavSubItem[] = [
    { label: "Overview", href: "/student", icon: LayoutDashboard },
    { label: "My Projects", href: "/student/projects", icon: FolderKanban },
    { label: "Consultations", href: "/student/bookings", icon: CalendarCheck },
    { label: "Messages", href: "/student/messages", icon: MessageSquare },
    { label: "Files & Drafts", href: "/student/files", icon: FileText },
    { label: "Billing & Invoices", href: "/student/billing", icon: CreditCard },
  ];

  // Admin Navigation Items
  const adminNav: DashboardNavSubItem[] = [
    { label: "Operations", href: "/admin", icon: LayoutDashboard },
    { label: "Support Requests", href: "/admin/projects", icon: FolderKanban },
    { label: "Bookings & Pool", href: "/admin/bookings", icon: CalendarCheck },
    { label: "Researchers", href: "/admin/students", icon: Users },
    { label: "Content & Blog", href: "/admin/blog", icon: BookOpen },
    { label: "Academic Integrity", href: "/admin/integrity", icon: ShieldCheck },
    { label: "Platform Settings", href: "/admin/settings", icon: Settings },
  ];

  const navItems = role === "admin" ? adminNav : studentNav;

  return (
    <div className="min-h-screen bg-paper flex flex-col md:flex-row text-tone-body">
      {/* Left Sidebar (Desktop / Tablet) */}
      <aside
        data-tone="navy-deep"
        className={cn(
          "hidden md:flex flex-col justify-between tone-navy-deep bg-navy-deep text-tone-body border-r border-tone-rule transition-all duration-200 z-30 shrink-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div>
          {/* Sidebar Top: Logo Symbol / Full */}
          <div className="h-16 flex items-center px-4 border-b border-tone-rule justify-between">
            {collapsed ? (
              <Logo variant="symbol" href={role === "admin" ? "/admin" : "/student"} />
            ) : (
              <div className="flex items-center gap-2">
                <Logo variant="full-white" href={role === "admin" ? "/admin" : "/student"} />
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-white/10 text-tone-body rounded-[2px]">
                  {role}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="text-tone-muted hover:text-white p-1"
            >
              <span className="text-xs">{collapsed ? "→" : "←"}</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1" aria-label="Dashboard navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-[2px] transition-colors duration-150",
                    isActive
                      ? "bg-white/10 text-white font-semibold border-l-2 border-l-gold"
                      : "text-tone-muted hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 text-tone-body" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom: Back to Public Site & Academic Code Note */}
        <div className="p-3 border-t border-tone-rule">
          {!collapsed && (
            <div className="p-2.5 bg-white/5 border border-tone-rule rounded-[2px] mb-2 text-[11px] text-tone-muted">
              <span className="font-semibold text-gold block mb-0.5">Integrity reminder</span>
              Mentors provide coaching only; all manuscript authorship remains strictly yours.
            </div>
          )}
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-xs text-tone-muted hover:text-white transition-colors"
          >
            <GraduationCap className="h-4 w-4 shrink-0" />
            {!collapsed && <span>View public site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-tone-rule px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-xl font-medium text-tone-heading">{title}</h1>
          </div>

          {/* Right Header items: Notifications & Profile Dropdown */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button
              type="button"
              aria-label="View notifications"
              className="relative p-2 text-tone-muted hover:text-tone-heading transition-colors rounded-[2px] border border-transparent hover:border-tone-rule"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-gold rounded-full" />
            </button>

            {/* Profile Menu Dropdown */}
            <DropdownMenu
              trigger={
                <div className="flex items-center gap-2.5 cursor-pointer select-none">
                  <Avatar name={user.name} size="sm" />
                  <div className="hidden sm:block text-left text-xs leading-tight">
                    <span className="font-semibold text-tone-heading block">{user.name}</span>
                    <span className="text-[10px] text-tone-muted block max-w-[140px] truncate">
                      {user.institution || user.email}
                    </span>
                  </div>
                </div>
              }
            >
              <div className="px-4 py-2 border-b border-tone-rule">
                <span className="block text-xs font-semibold text-tone-heading">{user.name}</span>
                <span className="block text-[11px] text-tone-muted truncate">{user.email}</span>
              </div>
              <DropdownItem onClick={() => {}}>Account Profile</DropdownItem>
              <DropdownItem onClick={() => {}}>Notification Preferences</DropdownItem>
              <DropdownSeparator />
              <DropdownItem onClick={() => {}} className="text-error hover:text-error hover:bg-error/5">
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out</span>
              </DropdownItem>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>

      {/* Mobile Bottom Tab Bar (Student Dashboard) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 pb-[env(safe-area-inset-bottom)] bg-navy-deep border-t border-white/10 z-40 flex items-center justify-around px-2"
      >
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center text-[10px] font-medium py-1 px-2 transition-colors",
                isActive ? "text-gold" : "text-white/60 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* More Tab Button */}
        <button
          type="button"
          onClick={() => setMobileMoreOpen(true)}
          className={cn(
            "flex flex-col items-center justify-center text-[10px] font-medium py-1 px-2 transition-colors",
            navItems.slice(4).some((i) => pathname === i.href) || mobileMoreOpen
              ? "text-gold"
              : "text-white/60 hover:text-white"
          )}
          aria-label="More navigation options"
        >
          <MoreHorizontal className="h-4 w-4 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile "More" Drawer / Slide-Over Sheet */}
      {mobileMoreOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Additional Navigation"
          onClick={() => setMobileMoreOpen(false)}
        >
          <div
            className="bg-navy-deep text-white border-t border-white/15 rounded-t-lg p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs uppercase tracking-wider font-semibold text-gold">
                Additional Tools & Settings
              </span>
              <button
                type="button"
                onClick={() => setMobileMoreOpen(false)}
                className="p-1 text-white/60 hover:text-white rounded-[2px]"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              {navItems.slice(4).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMoreOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-[2px] transition-colors",
                      isActive
                        ? "bg-white/10 text-gold font-semibold"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-white/70" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="p-3 bg-white/5 border border-white/10 rounded-[2px] text-xs text-white/70">
                <span className="font-semibold text-gold block mb-0.5">Integrity reminder</span>
                Mentors provide coaching only; all manuscript authorship remains strictly yours.
              </div>

              <Link
                href="/"
                onClick={() => setMobileMoreOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-xs text-white/70 hover:text-white transition-colors"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Return to Public Site</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

