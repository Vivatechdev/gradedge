"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageBreadcrumb } from "@/components/marketing/page-components";
import { type DaySlots, type TimeSlot } from "@/lib/booking/availability";

export default function ManageBookingPage() {
  const params = useParams();
  const token = typeof params?.token === "string" ? params.token : "";

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<{
    id: string;
    starts_at: string;
    ends_at: string;
    status: string;
    guest_name: string;
    guest_email: string;
    guest_topic?: string;
    meeting_url: string;
    timezone: string;
    localDate: string;
    localTimeDisplay: string;
  } | null>(null);
  const [canModify, setCanModify] = useState(false);
  const [hoursUntilStart, setHoursUntilStart] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [daySlots, setDaySlots] = useState<DaySlots[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDayIso, setSelectedDayIso] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [submittingAction, setSubmittingAction] = useState(false);

  // Cancellation state
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch(`/api/bookings/manage/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Booking not found");
        return res.json();
      })
      .then((data) => {
        setBooking(data.booking);
        setCanModify(data.canModify);
        setHoursUntilStart(data.hoursUntilStart);
        setLoading(false);
      })
      .catch((err) => {
        setError("Unable to find or load this booking. The link may have expired or is invalid.");
        setLoading(false);
      });
  }, [token]);

  const loadSlotsForReschedule = () => {
    setIsRescheduling(true);
    setIsCancelling(false);
    setLoadingSlots(true);

    const tz = booking?.timezone || "UTC";
    fetch(`/api/bookings/availability?timezone=${encodeURIComponent(tz)}&days=21`)
      .then((res) => res.json())
      .then((data) => {
        if (data.days) {
          setDaySlots(data.days);
          if (data.days.length > 0) {
            setSelectedDayIso(data.days[0].dateIso);
          }
        }
        setLoadingSlots(false);
      })
      .catch(() => {
        setLoadingSlots(false);
      });
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAction(true);
    setError(null);

    try {
      const res = await fetch(`/api/bookings/manage/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", reason: cancelReason }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to cancel booking.");
        setSubmittingAction(false);
        return;
      }

      setBooking((prev) => (prev ? { ...prev, status: "cancelled" } : null));
      setCanModify(false);
      setIsCancelling(false);
      setSuccessMessage("Your consultation has been cancelled and the slot immediately released.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedSlot) return;
    setSubmittingAction(true);
    setError(null);

    try {
      const res = await fetch(`/api/bookings/manage/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reschedule",
          starts_at: selectedSlot.startsAtUtc,
          timezone: booking?.timezone || "UTC",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reschedule booking.");
        setSubmittingAction(false);
        return;
      }

      setBooking((prev) =>
        prev
          ? {
              ...prev,
              starts_at: selectedSlot.startsAtUtc,
              localDate: data.newSlot.localDate,
              localTimeDisplay: data.newSlot.localTimeDisplay,
            }
          : null
      );
      setIsRescheduling(false);
      setSuccessMessage(`Your consultation has been rescheduled to ${data.newSlot.localDate} at ${data.newSlot.localTimeDisplay}. A revised calendar invite has been sent to your email.`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Book a Call", href: "/book" },
          { label: "Manage Booking" },
        ]}
      />

      <div className="site-container py-12 md:py-20 max-w-2xl">
        <div className="bg-white border border-[#E4DFD5] rounded-[4px] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#E4DFD5] pb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gold block mb-1">
              Consultation Self-Service
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-tone-heading">
              Manage Your Consultation
            </h1>
          </div>

          {loading ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-tone-muted font-sans">Locating your booking details...</p>
            </div>
          ) : error && !booking ? (
            <div className="p-4 bg-burgundy/10 border-l-2 border-burgundy rounded-[4px] text-xs font-sans text-tone-heading space-y-2">
              <p className="font-semibold">{error}</p>
              <p>Please check the link in your confirmation email or schedule a new call:</p>
              <Link href="/book" className="text-navy font-semibold underline block mt-2">
                Book a new consultation &rarr;
              </Link>
            </div>
          ) : booking ? (
            <div className="space-y-6">
              {/* Notifications */}
              {successMessage && (
                <div className="p-4 bg-forest/10 border-l-2 border-forest rounded-[4px] text-xs font-sans text-tone-heading">
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="p-4 bg-burgundy/10 border-l-2 border-burgundy rounded-[4px] text-xs font-sans text-tone-heading">
                  {error}
                </div>
              )}

              {/* Current Appointment Card */}
              <div className="p-5 bg-[#FAF8F4] border border-[#E4DFD5] rounded-[4px] space-y-3 font-sans text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-tone-muted">Status</span>
                  <span
                    className={`px-2 py-0.5 rounded-[2px] font-semibold text-[11px] ${
                      booking.status === "confirmed"
                        ? "bg-forest/10 text-forest border border-forest/20"
                        : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
                  </span>
                </div>

                <div>
                  <span className="text-tone-muted block text-[10px] uppercase font-bold text-gold">
                    Scheduled Appointment
                  </span>
                  <span className="text-sm font-semibold text-navy">
                    {booking.localDate} at {booking.localTimeDisplay}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#E4DFD5]">
                  <span className="text-tone-muted block text-[10px] uppercase">Researcher</span>
                  <span className="font-medium text-tone-heading">
                    {booking.guest_name} &bull; {booking.guest_email}
                  </span>
                </div>

                {booking.meeting_url && booking.status !== "cancelled" && (
                  <div className="pt-2 border-t border-[#E4DFD5]">
                    <span className="text-tone-muted block text-[10px] uppercase">Meeting Link</span>
                    <a
                      href={booking.meeting_url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-navy font-semibold underline break-all"
                    >
                      {booking.meeting_url}
                    </a>
                  </div>
                )}
              </div>

              {/* Status Notice if within 6 hours */}
              {booking.status === "confirmed" && !canModify && hoursUntilStart !== null && (
                <div className="p-4 bg-[#FAF8F4] border border-[#E4DFD5] rounded-[4px] text-xs font-sans text-tone-muted leading-relaxed">
                  <strong>6-Hour Notice Policy:</strong> Your appointment is scheduled in{" "}
                  <strong>{hoursUntilStart} hours</strong>. Online rescheduling and cancellation is permitted up to 6 hours before start. If you cannot attend due to an emergency, please notify our team via{" "}
                  <Link href="/contact" className="text-navy font-semibold underline">
                    our contact desk
                  </Link>.
                </div>
              )}

              {/* Action Buttons if canModify */}
              {booking.status === "confirmed" && canModify && !isRescheduling && !isCancelling && (
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={loadSlotsForReschedule}
                    className="px-5 py-2.5 bg-navy text-white text-xs font-semibold rounded-[4px] hover:bg-navy/90 cursor-pointer shadow-xs"
                  >
                    Reschedule Appointment &rarr;
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCancelling(true);
                      setIsRescheduling(false);
                    }}
                    className="px-5 py-2.5 bg-white border border-[#E4DFD5] text-xs font-semibold text-burgundy hover:bg-burgundy/5 rounded-[4px] cursor-pointer"
                  >
                    Cancel Consultation
                  </button>
                </div>
              )}

              {/* ── CANCELLATION DIALOG ────────────────────────────────────── */}
              {isCancelling && (
                <form
                  onSubmit={handleCancelSubmit}
                  className="p-5 border border-burgundy/30 bg-burgundy/5 rounded-[4px] space-y-4 font-sans text-xs"
                >
                  <span className="font-semibold text-burgundy text-sm block">
                    Confirm Cancellation
                  </span>
                  <p className="text-tone-body">
                    Are you sure you want to cancel your consultation for <strong>{booking.localDate} at {booking.localTimeDisplay}</strong>? Your slot will be freed immediately.
                  </p>

                  <div className="space-y-1 text-left">
                    <label htmlFor="cancel_reason" className="font-medium text-tone-heading block">
                      Optional reason for cancellation:
                    </label>
                    <input
                      id="cancel_reason"
                      type="text"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="e.g. Committee meeting rescheduled, solved blocker independently..."
                      className="w-full border border-[#E4DFD5] bg-white px-3 py-2 rounded-[4px] text-xs"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submittingAction}
                      className="px-4 py-2 bg-burgundy text-white font-semibold rounded-[4px] hover:bg-burgundy/90 disabled:opacity-50"
                    >
                      {submittingAction ? "Cancelling..." : "Confirm Cancellation"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCancelling(false)}
                      className="px-4 py-2 bg-white border border-[#E4DFD5] text-tone-muted rounded-[4px]"
                    >
                      Keep Booking
                    </button>
                  </div>
                </form>
              )}

              {/* ── RESCHEDULE PICKER ──────────────────────────────────────── */}
              {isRescheduling && (
                <div className="p-5 border border-gold/40 bg-[#FAF8F4] rounded-[4px] space-y-4 font-sans">
                  <span className="font-serif text-base font-semibold text-tone-heading block">
                    Select Replacement Time ({booking.timezone})
                  </span>

                  {loadingSlots ? (
                    <div className="py-8 text-center text-xs text-tone-muted">
                      Loading available times...
                    </div>
                  ) : daySlots.length === 0 ? (
                    <div className="text-xs text-tone-muted">No replacement slots available.</div>
                  ) : (
                    <div className="space-y-4">
                      {/* Day row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {daySlots.slice(0, 8).map((day) => (
                          <button
                            key={day.dateIso}
                            type="button"
                            onClick={() => {
                              setSelectedDayIso(day.dateIso);
                              setSelectedSlot(null);
                            }}
                            className={`p-2.5 text-left border rounded-[4px] text-xs ${
                              selectedDayIso === day.dateIso
                                ? "bg-navy text-white border-navy"
                                : "bg-white text-tone-body border-[#E4DFD5]"
                            }`}
                          >
                            <span className="block font-medium">{day.dateLabel.split(",")[0]}</span>
                            <span className="text-[10px] opacity-80">{day.dateLabel.split(",")[1]}</span>
                          </button>
                        ))}
                      </div>

                      {/* Time slot buttons */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-tone-muted block">
                          Available Times:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {(daySlots.find((d) => d.dateIso === selectedDayIso)?.slots || []).map(
                            (slot) => (
                              <button
                                key={slot.startsAtUtc}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-2 px-3 border rounded-[4px] text-xs text-center ${
                                  selectedSlot?.startsAtUtc === slot.startsAtUtc
                                    ? "bg-gold text-navy font-semibold border-gold"
                                    : "bg-white text-tone-heading border-[#E4DFD5] hover:border-gold"
                                }`}
                              >
                                {slot.localTime} ({slot.timezoneShort})
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-3 border-t border-[#E4DFD5]">
                        <button
                          type="button"
                          disabled={!selectedSlot || submittingAction}
                          onClick={handleRescheduleSubmit}
                          className="px-5 py-2 bg-gold text-navy font-semibold text-xs rounded-[4px] disabled:opacity-50"
                        >
                          {submittingAction
                            ? "Updating Schedule..."
                            : selectedSlot
                            ? `Confirm New Time: ${selectedSlot.localDate.split(",")[0]}, ${selectedSlot.localTime}`
                            : "Select a time above"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsRescheduling(false)}
                          className="px-4 py-2 bg-white border border-[#E4DFD5] text-xs text-tone-muted rounded-[4px]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
