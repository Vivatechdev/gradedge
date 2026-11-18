"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface NotificationBellProps {
  userId?: string;
  role?: "admin" | "student";
  initialCount?: number;
}

export function NotificationBell({
  userId,
  role = "student",
  initialCount = 0,
}: NotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState<number>(initialCount);
  const href = role === "admin" ? "/admin/notifications" : "/student/notifications";

  useEffect(() => {
    // 1. Initial fetch from unread count endpoint
    let isMounted = true;
    async function loadCount() {
      try {
        const res = await fetch("/api/student/notifications/unread-count");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && typeof data.count === "number") {
            setUnreadCount(data.count);
          }
        }
      } catch {
        // Fallback gracefully
      }
    }
    loadCount();

    // 2. Setup Supabase Realtime subscription
    if (!userId) return;

    try {
      const supabase = createClient();
      const channel = supabase
        .channel(`public:notifications:user:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload: any) => {
            if (!payload.new.read_at) {
              setUnreadCount((prev) => prev + 1);
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload: any) => {
            if (payload.new.read_at && !payload.old.read_at) {
              setUnreadCount((prev) => Math.max(0, prev - 1));
            } else if (!payload.new.read_at && payload.old.read_at) {
              setUnreadCount((prev) => prev + 1);
            }
          }
        )
        .subscribe();

      return () => {
        isMounted = false;
        supabase.removeChannel(channel);
      };
    } catch (err) {
      // Realtime fallback
      return () => {
        isMounted = false;
      };
    }
  }, [userId]);

  return (
    <Link
      href={href}
      aria-label={
        unreadCount > 0
          ? `${unreadCount} unread notifications. Click to view.`
          : "View notifications"
      }
      className="relative p-2 text-tone-muted hover:text-tone-heading transition-colors rounded-[2px] border border-transparent hover:border-tone-rule focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
    >
      <Bell className="h-4 w-4" aria-hidden="true" />
      {unreadCount > 0 && (
        <span
          role="status"
          aria-live="polite"
          className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}

