"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Bell,
  CheckCircle2,
  Calendar,
  FileText,
  CreditCard,
  MessageSquare,
  ArrowRight,
  Check,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export default function StudentNotificationsPage() {
  const student = useStudent();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/student/notifications");
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/student/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, read_at: new Date().toISOString() } : n
          )
        );
        toast({
          title: "Notification Updated",
          message: "Marked as read.",
          type: "success",
        });
      }
    } catch {
      toast({
        title: "Action Failed",
        message: "Unable to update notification status.",
        type: "error",
      });
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      const res = await fetch("/api/student/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
        );
        toast({
          title: "All Caught Up",
          message: "All notifications marked as read.",
          type: "success",
        });
      }
    } catch {
      toast({
        title: "Action Failed",
        message: "Unable to mark all notifications as read.",
        type: "error",
      });
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;
  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read_at)
      : notifications;

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "session":
      case "booking":
        return <Calendar className="h-4 w-4 text-gold" />;
      case "file":
      case "draft":
        return <FileText className="h-4 w-4 text-navy" />;
      case "payment":
      case "invoice":
      case "billing":
        return <CreditCard className="h-4 w-4 text-navy-deep" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-gold" />;
      default:
        return <Bell className="h-4 w-4 text-navy" />;
    }
  };

  return (
    <DashboardShell
      role="student"
      title="Notifications"
      user={{
        name: student.name,
        email: student.email,
        institution: student.institution,
      }}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="border-b border-tone-rule pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="type-micro text-gold">Activity Stream</span>
            <h1 className="font-serif text-2xl font-medium text-tone-heading">
              Notifications & Updates
            </h1>
            <p className="text-xs text-tone-muted leading-relaxed font-sans">
              Critical updates regarding your research drafts, upcoming sessions, and invoice status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="text-xs font-sans"
              >
                <Check className="h-3.5 w-3.5 mr-1 text-gold" />
                {markingAll ? "Marking..." : "Mark all as read"}
              </Button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between border-b border-tone-rule pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`text-xs px-3 py-1.5 rounded-[2px] transition-colors ${
                filter === "all"
                  ? "bg-navy-deep text-white font-medium"
                  : "text-tone-muted hover:text-tone-heading hover:bg-paper-dark"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`text-xs px-3 py-1.5 rounded-[2px] transition-colors flex items-center gap-1.5 ${
                filter === "unread"
                  ? "bg-navy-deep text-white font-medium"
                  : "text-tone-muted hover:text-tone-heading hover:bg-paper-dark"
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-gold text-navy-deep font-semibold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 bg-white border border-tone-rule rounded-[2px] flex items-start gap-4"
              >
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white border border-tone-rule rounded-[2px] p-8 text-center">
            <EmptyState
              title={filter === "unread" ? "No unread notifications" : "No notifications yet"}
              description={
                filter === "unread"
                  ? "You have acknowledged all recent activity updates. Check back later for mentor notes or schedule changes."
                  : "When your mentor leaves draft annotations, verifies milestones, or confirms sessions, notifications will arrive here."
              }
              action={
                filter === "unread" ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setFilter("all")}
                    className="mt-2 text-xs"
                  >
                    View past notifications
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-tone-rule bg-white border border-tone-rule rounded-[2px]">
            {filteredNotifications.map((n) => {
              const isUnread = !n.read_at;
              return (
                <div
                  key={n.id}
                  className={`p-4 transition-colors flex items-start justify-between gap-4 ${
                    isUnread ? "bg-gold/5" : "hover:bg-paper/40"
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border ${
                        isUnread
                          ? "bg-white border-gold/40 text-gold shadow-sm"
                          : "bg-paper-light border-tone-rule text-tone-muted"
                      }`}
                    >
                      {getTypeIcon(n.type)}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className={`text-xs font-semibold ${
                            isUnread ? "text-tone-heading font-medium" : "text-tone-body"
                          }`}
                        >
                          {n.title}
                        </h3>
                        {isUnread && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-gold/40 text-gold">
                            New
                          </Badge>
                        )}
                        <span className="text-[11px] text-tone-muted font-sans ml-auto shrink-0">
                          {new Date(n.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-tone-body font-sans leading-relaxed">
                        {n.body}
                      </p>
                      {n.link && (
                        <div className="pt-1.5">
                          <Link
                            href={n.link}
                            className="inline-flex items-center gap-1 text-xs text-navy hover:text-navy-deep font-medium hover:underline"
                          >
                            <span>Open reference</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {isUnread && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(n.id)}
                      title="Mark as read"
                      className="p-1.5 text-tone-muted hover:text-tone-heading rounded hover:bg-white/80 transition-colors shrink-0"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
