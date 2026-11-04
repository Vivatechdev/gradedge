"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { type DaySlots, type TimeSlot } from "@/lib/booking/availability";

const PAID_SERVICES = [
  {
    id: "serv-tutoring",
    name: "One-on-One Research & Methodology Tutoring",
    duration: "60 minutes",
    fee: "$120 / session",
    desc: "Intensive methodological consultation with an assigned discipline specialist.",
  },
  {
    id: "serv-data",
    name: "Quantitative & Statistical Modeling Review",
    duration: "60 minutes",
    fee: "$160 / session",
    desc: "Syntax audit, regression diagnostics, or structural equation model coaching.",
  },
  {
    id: "serv-editing",
    name: "Developmental Editing & Chapter Critique",
    duration: "60 minutes",
    fee: "$140 / session",
    desc: "Line-by-line structural, rhetorical, and argument coherence review.",
  },
  {
    id: "serv-defense",
    name: "Mock Defense Presentation & Viva Coaching",
    duration: "60 minutes",
    fee: "$180 / session",
    desc: "Simulated committee questioning, slide review, and defense strategy.",
  },
];

export default function BookPaidSessionPage() {
  const router = useRouter();

  const [serviceId, setServiceId] = useState(PAID_SERVICES[0].id);
  const [timezone, setTimezone] = useState("UTC");
  const [daySlots, setDaySlots] = useState<DaySlots[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedDayIso, setSelectedDayIso] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<{
    bookingId: string;
    expiresAt: string;
    startsAt: string;
  } | null>(null);

  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) setTimezone(detected);
    } catch {
      setTimezone("UTC");
    }
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingSlots(true);

    fetch(`/api/bookings/availability?timezone=${encodeURIComponent(timezone)}&days=21`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.days && Array.isArray(data.days)) {
          setDaySlots(data.days);
          if (data.days.length > 0) {
            setSelectedDayIso(data.days[0].dateIso);
          }
        }
        setLoadingSlots(false);
      })
      .catch(() => {
        if (!active) return;
        setLoadingSlots(false);
      });

    return () => {
      active = false;
    };
  }, [timezone]);

  const activeDay = daySlots.find((d) => d.dateIso === selectedDayIso) || daySlots[0];

  const handleReserveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings/paid-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          starts_at: selectedSlot.startsAtUtc,
          timezone,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reserve session. Please try another slot.");
        setIsSubmitting(false);
        return;
      }

      setReservation({
        bookingId: data.bookingId,
        expiresAt: data.expiresAt,
        startsAt: data.startsAt,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceObj = PAID_SERVICES.find((s) => s.id === serviceId) || PAID_SERVICES[0];

  return (
    <DashboardShell role="student">
      <div className="max-w-3xl mx-auto space-y-6 font-sans">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-tone-muted">
            <Link href="/student" className="hover:text-navy">
              Dashboard
            </Link>
            <span>&rarr;</span>
            <span className="text-tone-heading font-medium">Book Paid Session</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-tone-heading">
            Schedule a Research Session
          </h1>
          <p className="text-xs sm:text-sm text-tone-muted leading-relaxed">
            Reserve dedicated one-on-one time with a methodology specialist. Mentors are matched to your discipline by our academic director.
          </p>
        </div>

        {reservation ? (
          <div className="bg-white border border-[#E4DFD5] rounded-[4px] p-8 text-center space-y-5 shadow-xs">
            <div className="w-12 h-12 bg-gold/15 text-gold border border-gold/30 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              &clock;
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold block">
                Slot Reserved &bull; Pending Payment
              </span>
              <h2 className="font-serif text-2xl font-semibold text-tone-heading">
                Your session is held for 15 minutes
              </h2>
              <p className="text-xs sm:text-sm text-tone-muted max-w-lg mx-auto leading-relaxed">
                We have temporarily reserved your slot. Please complete your checkout below to finalize your booking and confirm your assigned faculty mentor.
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F4] border border-[#E4DFD5] rounded-[4px] max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-tone-muted">Service:</span>
                <span className="font-semibold text-navy">{selectedServiceObj.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tone-muted">Fee:</span>
                <span className="font-mono text-navy font-semibold">{selectedServiceObj.fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tone-muted">Hold Expires:</span>
                <span className="text-burgundy font-semibold">15 minutes from reservation</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => router.push(`/checkout?bookingId=${reservation.bookingId}`)}
                className="px-8 py-2.5 bg-gold text-navy font-semibold text-xs sm:text-sm rounded-[4px] hover:bg-gold/90 transition-colors shadow-xs"
              >
                Proceed to Payment &rarr;
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReserveSlot} className="bg-white border border-[#E4DFD5] rounded-[4px] p-6 sm:p-8 space-y-6 shadow-xs">
            {error && (
              <div
                role="alert"
                className="p-3.5 bg-burgundy/10 border-l-2 border-burgundy rounded-[4px] text-xs text-burgundy font-medium"
              >
                {error}
              </div>
            )}

            {/* Service Choice Cards */}
            <div className="space-y-2 text-left">
              <span className="text-xs font-semibold text-tone-heading block uppercase tracking-wider">
                1. Select Coaching Service
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAID_SERVICES.map((serv) => {
                  const isSelected = serv.id === serviceId;
                  return (
                    <button
                      key={serv.id}
                      type="button"
                      onClick={() => setServiceId(serv.id)}
                      className={`p-4 text-left border rounded-[4px] transition-all cursor-pointer ${
                        isSelected
                          ? "border-navy bg-navy/5 text-navy font-semibold shadow-xs"
                          : "border-[#E4DFD5] bg-paper text-tone-body hover:border-gold"
                      }`}
                    >
                      <span className="font-serif text-sm block text-tone-heading font-semibold">
                        {serv.name}
                      </span>
                      <span className="text-[11px] text-gold font-mono block mt-1">
                        {serv.fee} &bull; {serv.duration}
                      </span>
                      <span className="text-xs text-tone-muted block mt-1 leading-relaxed">
                        {serv.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-3 text-left pt-2 border-t border-[#E4DFD5]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-tone-heading block uppercase tracking-wider">
                  2. Choose Appointment Time
                </span>
                <span className="text-[11px] text-tone-muted">Timezone: {timezone}</span>
              </div>

              {loadingSlots ? (
                <div className="py-8 text-center text-xs text-tone-muted">
                  Loading available mentor slots...
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Days */}
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
                            : "bg-paper text-tone-body border-[#E4DFD5]"
                        }`}
                      >
                        <span className="block font-medium">{day.dateLabel.split(",")[0]}</span>
                        <span className="text-[10px] opacity-80">{day.dateLabel.split(",")[1]}</span>
                      </button>
                    ))}
                  </div>

                  {/* Times */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(activeDay?.slots || []).map((slot) => (
                      <button
                        key={slot.startsAtUtc}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 border rounded-[4px] text-xs text-center ${
                          selectedSlot?.startsAtUtc === slot.startsAtUtc
                            ? "bg-gold text-navy font-semibold border-gold shadow-xs"
                            : "bg-white text-tone-heading border-[#E4DFD5] hover:border-gold"
                        }`}
                      >
                        {slot.localTime} ({slot.timezoneShort})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-1.5 text-left pt-2 border-t border-[#E4DFD5]">
              <label htmlFor="notes" className="text-xs font-semibold text-tone-heading block">
                Session Focus & Goals (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What specific questions or draft sections would you like to review during this hour?"
                className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            {/* Mentor Assignment Policy */}
            <div className="p-3.5 bg-[#FAF8F4] border border-[#E4DFD5] rounded-[4px] text-[11px] text-tone-muted text-left leading-relaxed">
              <strong>Mentor Matching:</strong> Mentors are assigned by our academic leadership based on your discipline, methodology, and software tools. You will be shown your assigned mentor and meeting details immediately upon payment confirmation.
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-between border-t border-[#E4DFD5]">
              <Link href="/student" className="text-xs text-tone-muted hover:text-navy">
                &larr; Return to Workspace
              </Link>

              <button
                type="submit"
                disabled={!selectedSlot || isSubmitting}
                className="px-8 py-2.5 bg-gold text-navy font-semibold text-xs sm:text-sm rounded-[4px] hover:bg-gold/90 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isSubmitting
                  ? "Holding Slot..."
                  : selectedSlot
                  ? `Reserve ${selectedSlot.localDate.split(",")[0]} at ${selectedSlot.localTime} &rarr;`
                  : "Select a slot above"}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  );
}

