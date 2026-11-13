"use client";

import React, { useEffect, useState, useRef } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useStudent } from "@/components/layout/student-context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  MessageSquare,
  Send,
  Paperclip,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Plus,
} from "lucide-react";

export default function StudentMessagesPage() {
  const student = useStudent();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [threads, setThreads] = useState<any[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [responseWindow, setResponseWindow] = useState<string>(
    "24 business hours (Monday–Friday, 9:00 AM – 6:00 PM)"
  );
  const [loading, setLoading] = useState(true);

  // Send message form
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  // New Thread Modal
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [initialMsg, setInitialMsg] = useState("");

  const loadMessages = async () => {
    try {
      const res = await fetch("/api/student/messages");
      const json = await res.json();
      if (res.ok) {
        setThreads(json.threads || []);
        if (json.responseWindow) setResponseWindow(json.responseWindow);
        if (json.threads && json.threads.length > 0 && !activeThreadId) {
          setActiveThreadId(json.threads[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threads, activeThreadId]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0] || null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeThread) return;

    setSending(true);
    const content = newMessage.trim();
    setNewMessage("");

    // Optimistic UI update
    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      senderId: student.id,
      isMe: true,
      body: content,
      createdAt: new Date().toISOString(),
      readAt: null,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              lastMessageAt: new Date().toISOString(),
              messages: [...t.messages, optimisticMsg],
            }
          : t
      )
    );

    try {
      const res = await fetch("/api/student/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: activeThread.id,
          messageBody: content,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to deliver message");

      toast({
        title: "Message Dispatched",
        message: "Your message has been delivered to your faculty advisor.",
        type: "success",
      });
      await loadMessages();
    } catch (err: any) {
      toast({ title: "Delivery Error", message: err.message, type: "error" });
    } finally {
      setSending(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !initialMsg.trim()) return;

    setSending(true);
    try {
      const res = await fetch("/api/student/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: newSubject.trim(),
          messageBody: initialMsg.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to start thread");

      toast({
        title: "Thread Created",
        message: "Consultation inquiry dispatched to your advisory team.",
        type: "success",
      });

      setShowNewThreadModal(false);
      setNewSubject("");
      setInitialMsg("");
      await loadMessages();
      if (json.threadId) setActiveThreadId(json.threadId);
    } catch (err: any) {
      toast({ title: "Error", message: err.message, type: "error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardShell
      role="student"
      title="Messages"
      user={{
        name: student.name,
        email: student.email,
        institution: student.institution,
      }}
    >
      <div className="space-y-6">
        {/* Header & Response Window Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-tone-rule pb-4">
          <div className="space-y-1">
            <span className="type-micro text-gold">Advisory Communications</span>
            <h1 className="font-serif text-2xl font-medium text-tone-heading">
              Faculty Mentor Messenger
            </h1>
          </div>
          <Button
            variant="accent"
            size="sm"
            onClick={() => setShowNewThreadModal(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>New Consultation Thread</span>
          </Button>
        </div>

        {/* Stated Response Window Notice from Settings */}
        <div className="p-3 bg-paper border border-tone-rule rounded-[2px] flex items-center justify-between text-xs text-tone-muted">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold shrink-0" />
            <span>
              Expected response window: <strong className="text-tone-heading">{responseWindow}</strong>.
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] font-mono text-stone-400">
            Digest notifications enabled
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : threads.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-8 h-8 text-tone-muted" />}
            title="No consultation threads open"
            description="Initiate a direct conversation with your assigned discipline advisor or the GradEdge academic support desk."
            action={
              <Button variant="accent" onClick={() => setShowNewThreadModal(true)}>
                Start Consultation Thread
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-tone-rule rounded-[2px] overflow-hidden shadow-xs min-h-[560px]">
            {/* THREADS SIDEBAR */}
            <div className="border-r border-tone-rule bg-paper/40 flex flex-col">
              <div className="p-3.5 border-b border-tone-rule bg-white">
                <span className="text-[10px] uppercase font-mono tracking-wider text-tone-muted block">
                  Threads ({threads.length})
                </span>
              </div>

              <div className="divide-y divide-tone-rule overflow-y-auto flex-1">
                {threads.map((t) => {
                  const isSelected = t.id === activeThreadId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveThreadId(t.id)}
                      className={`w-full text-left p-3.5 transition-colors cursor-pointer block ${
                        isSelected
                          ? "bg-white border-l-4 border-l-navy"
                          : "hover:bg-paper"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-serif text-xs font-semibold text-tone-heading truncate block">
                          {t.mentorName}
                        </span>
                        {t.unreadCount > 0 && (
                          <span className="w-2 h-2 rounded-full bg-gold shrink-0" title="Unread messages" />
                        )}
                      </div>
                      <p className="text-xs text-tone-body font-medium truncate mb-1">
                        {t.subject}
                      </p>
                      <span className="text-[10px] text-tone-muted font-mono block">
                        {new Date(t.lastMessageAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CHAT CONVERSATION PANE */}
            {activeThread ? (
              <div className="md:col-span-2 flex flex-col justify-between h-full min-h-[560px]">
                {/* Chat Header */}
                <div className="p-4 border-b border-tone-rule bg-paper/30 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-sm font-semibold text-tone-heading">
                      {activeThread.subject}
                    </h2>
                    <span className="text-[11px] text-tone-muted">
                      With: {activeThread.mentorName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-paper border border-tone-rule px-2 py-0.5 rounded-[2px] text-navy">
                    Encrypted Thread
                  </span>
                </div>

                {/* Messages Stream */}
                <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 max-h-[420px]">
                  {activeThread.messages.map((m: any) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.isMe ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-tone-muted">
                        <span className="font-medium">
                          {m.isMe ? "You" : activeThread.mentorName}
                        </span>
                        <span>&bull;</span>
                        <span className="font-mono">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div
                        className={`p-3.5 rounded-[2px] max-w-lg text-xs leading-relaxed space-y-2 ${
                          m.isMe
                            ? "bg-navy text-white"
                            : "bg-paper border border-tone-rule text-tone-body"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.body}</p>

                        {m.attachment && (
                          <div className="pt-2 border-t border-white/20 flex items-center gap-1.5 text-[11px]">
                            <FileText className="w-3 h-3 text-gold" />
                            <span className="underline">{m.attachment.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSendMessage} className="p-3.5 border-t border-tone-rule bg-white">
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Write your research query or revision feedback for your mentor..."
                      className="w-full text-xs p-2.5 border border-tone-rule rounded-[2px] bg-paper/30 focus:outline-none focus:border-navy focus:bg-white resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-tone-muted">
                        Press Send to dispatch email digest notification.
                      </span>
                      <Button
                        type="submit"
                        variant="accent"
                        size="sm"
                        disabled={sending || !newMessage.trim()}
                        className="font-semibold text-xs"
                      >
                        <Send className="w-3 h-3 mr-1.5" />
                        <span>Send Message</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            ) : null}
          </div>
        )}

        {/* NEW THREAD MODAL */}
        {showNewThreadModal && (
          <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-tone-rule rounded-[2px] w-full max-w-lg p-6 space-y-4 shadow-2xl">
              <div className="border-b border-tone-rule pb-3">
                <h3 className="font-serif text-lg font-medium text-tone-heading">
                  Open New Consultation Thread
                </h3>
                <p className="text-xs text-tone-muted">
                  Direct your question to your discipline mentor or academic methodology coordinator.
                </p>
              </div>

              <form onSubmit={handleCreateThread} className="space-y-3.5 text-xs font-sans">
                <div className="space-y-1">
                  <label className="font-semibold text-tone-heading block">Subject / Research Area</label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g. Question on Chapter 4 SEM Model Fit Indices"
                    className="w-full h-9 px-3 text-xs bg-white border border-tone-rule rounded-[2px] focus:outline-none focus:border-navy"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-tone-heading block">Initial Message</label>
                  <textarea
                    required
                    rows={4}
                    value={initialMsg}
                    onChange={(e) => setInitialMsg(e.target.value)}
                    placeholder="Detail your question, manuscript excerpt, or methodology context..."
                    className="w-full p-3 text-xs bg-white border border-tone-rule rounded-[2px] focus:outline-none focus:border-navy"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-tone-rule">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowNewThreadModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="sm"
                    disabled={sending || !newSubject.trim() || !initialMsg.trim()}
                  >
                    {sending ? "Creating..." : "Start Thread"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

