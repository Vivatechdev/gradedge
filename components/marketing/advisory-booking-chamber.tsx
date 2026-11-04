"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type DaySlots, type TimeSlot } from "@/lib/booking/availability";

const ACADEMIC_TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "Africa/Lagos", label: "West Africa Time (WAT / UTC+1)" },
  { value: "Africa/Johannesburg", label: "South Africa Standard Time (SAST / UTC+2)" },
  { value: "Europe/London", label: "UK / London (GMT / BST)" },
  { value: "Europe/Berlin", label: "Central European Time (CET / UTC+1)" },
  { value: "America/New_York", label: "US Eastern Time (EST / EDT)" },
  { value: "America/Chicago", label: "US Central Time (CST / CDT)" },
  { value: "America/Denver", label: "US Mountain Time (MST / MDT)" },
  { value: "America/Los_Angeles", label: "US Pacific Time (PST / PDT)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST / UTC+4)" },
  { value: "Asia/Singapore", label: "Singapore / Perth Time (SGT / UTC+8)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AEST / AEDT)" },
];

export function AdvisoryBookingChamber() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Timezone selection & detection
  const [timezone, setTimezone] = useState("UTC");
  const [detectedTz, setDetectedTz] = useState("UTC");

  // Availability data
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [daySlots, setDaySlots] = useState<DaySlots[]>([]);
  const [selectedDayIso, setSelectedDayIso] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Step 2 Form details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studyLevel, setStudyLevel] = useState("phd");
  const [topicHelp, setTopicHelp] = useState("");
  const [message, setMessage] = useState("");

  // Submission & Conflict State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conflictSlots, setConflictSlots] = useState<TimeSlot[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    bookingId: string;
    localDate: string;
    localTimeDisplay: string;
    meetingUrl: string;
    manageUrl: string;
  } | null>(null);

  // Detect browser timezone on mount
  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) {
        setTimezone(detected);
        setDetectedTz(detected);
      }
    } catch {
      setTimezone("UTC");
    }
  }, []);

  // Fetch available slots whenever timezone changes
  useEffect(() => {
    let active = true;
    setLoadingSlots(true);
    setErrorMessage(null);

    fetch(`/api/bookings/availability?timezone=${encodeURIComponent(timezone)}&days=21`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.days && Array.isArray(data.days)) {
          setDaySlots(data.days);
          if (data.days.length > 0) {
            // Default to first day with available slots
            const firstWithSlots = data.days.find((d: DaySlots) => d.slots.length > 0) || data.days[0];
            setSelectedDayIso(firstWithSlots.dateIso);
          }
        }
        setLoadingSlots(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Availability load error:", err);
        setErrorMessage("Unable to load live availability. Please check your internet connection.");
        setLoadingSlots(false);
      });

    return () => {
      active = false;
    };
  }, [timezone]);

  const activeDayObj = daySlots.find((d) => d.dateIso === selectedDayIso) || daySlots[0];

  // Submit Booking (Step 2 -> Step 3)
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMessage("Please select a time slot to proceed.");
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setConflictSlots([]);

    try {
      const res = await fetch("/api/bookings/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          starts_at: selectedSlot.startsAtUtc,
          timezone,
          full_name: fullName,
          email,
          study_level: studyLevel,
          topic_help: topicHelp,
          message: message || undefined,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        // Double-booking collision handled gracefully
        setErrorMessage(data.error || "Someone just took that time. Here are the next ones.");
        if (data.nextSlots && Array.isArray(data.nextSlots)) {
          setConflictSlots(data.nextSlots);
        }
        setIsSubmitting(false);
        return;
      }

      if (!res.ok) {
        setErrorMessage(data.error || "Unable to confirm your consultation. Please review your details.");
        setIsSubmitting(false);
        return;
      }

      setConfirmedBooking({
        bookingId: data.bookingId,
        localDate: data.localDate,
        localTimeDisplay: data.localTimeDisplay,
        meetingUrl: data.meetingUrl,
        manageUrl: data.manageUrl,
      });

      setStep(3);
    } catch {
      setErrorMessage("Network error connecting to booking engine. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#E4DFD5] rounded-[4px] shadow-sm overflow-hidden">
      {/* ── STEP HEADER BAR ──────────────────────────────────────────────── */}
      <div className="border-b border-[#E4DFD5] px-6 py-4 bg-[#FAF8F4] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#C8963E] block">
            Advisory Consultation &bull; Free 20 Minutes
          </span>
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-tone-heading">
            {step === 1 && "Step 1: Choose a Day and Time"}
            {step === 2 && "Step 2: Your Details & Research Focus"}
            {step === 3 && "Step 3: Consultation Confirmed"}
          </h2>
        </div>

        {/* Calm Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-sans">
          <span
            className={cn(
              "px-2.5 py-1 rounded-[2px] font-medium border",
              step === 1
                ? "bg-navy text-white border-navy"
                : "bg-white text-tone-muted border-[#E4DFD5]"
            )}
          >
            1. Day & Time
          </span>
          <span className="text-[#E4DFD5]">&rarr;</span>
          <span
            className={cn(
              "px-2.5 py-1 rounded-[2px] font-medium border",
              step === 2
                ? "bg-navy text-white border-navy"
                : "bg-white text-tone-muted border-[#E4DFD5]"
            )}
          >
            2. Details
          </span>
          <span className="text-[#E4DFD5]">&rarr;</span>
          <span
            className={cn(
              "px-2.5 py-1 rounded-[2px] font-medium border",
              step === 3
                ? "bg-gold text-navy font-semibold border-gold"
                : "bg-white text-tone-muted border-[#E4DFD5]"
            )}
          >
            3. Confirmation
          </span>
        </div>
      </div>

      {/* ── STEP 1: CHOOSE DAY AND TIME ──────────────────────────────────── */}
      {step === 1 && (
        <div className="p-6 sm:p-8 space-y-6">
          {/* Timezone Selector Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-[#FAF8F4] border border-[#E4DFD5] rounded-[4px]">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-tone-heading block">
                Timezone for Consultation Slots
              </span>
              <p className="text-[11px] text-tone-muted">
                Showing all times in your local zone. Always displayed beside the time.
              </p>
            </div>

            <div className="w-full sm:w-auto">
              <select
                id="timezone-selector"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full sm:w-72 border border-[#E4DFD5] bg-white text-xs px-3 py-1.5 rounded-[4px] text-tone-heading focus:outline-none focus:ring-1 focus:ring-gold font-sans"
              >
                {ACADEMIC_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
                {!ACADEMIC_TIMEZONES.some((tz) => tz.value === detectedTz) && (
                  <option value={detectedTz}>Detected: {detectedTz}</option>
                )}
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loadingSlots ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-sans text-tone-muted">
                Calculating live advisory slots in {timezone}...
              </p>
            </div>
          ) : daySlots.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF8F4] border border-[#E4DFD5] rounded-[4px] space-y-2">
              <p className="font-serif text-base text-tone-heading">No open slots in this date range</p>
              <p className="text-xs text-tone-muted font-sans">
                Our advisors are currently reviewing ongoing submissions. Please contact us or check back shortly.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Day Selector Row */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-tone-heading block uppercase tracking-wider">
                  Select Consultation Day
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {daySlots.slice(0, 10).map((day) => {
                    const isSelected = day.dateIso === selectedDayIso;
                    const count = day.slots.length;
                    return (
                      <button
                        key={day.dateIso}
                        type="button"
                        onClick={() => {
                          setSelectedDayIso(day.dateIso);
                          setSelectedSlot(null);
                        }}
                        className={cn(
                          "p-3 text-left border rounded-[4px] transition-colors cursor-pointer",
                          isSelected
                            ? "border-navy bg-navy/5 text-navy font-semibold shadow-xs"
                            : "border-[#E4DFD5] bg-white text-tone-body hover:border-gold"
                        )}
                      >
                        <span className="text-[11px] text-tone-muted block truncate font-sans">
                          {day.dateLabel.split(",")[0]}
                        </span>
                        <span className="text-xs font-semibold text-tone-heading block truncate">
                          {day.dateLabel.split(",")[1] || day.dateIso}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-mono block mt-1.5",
                            count > 0 ? "text-gold font-semibold" : "text-tone-muted"
                          )}
                        >
                          {count > 0 ? `${count} open ${count === 1 ? "slot" : "slots"}` : "Full"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots for Selected Day */}
              <div className="space-y-2 pt-2 border-t border-[#E4DFD5]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-tone-heading block uppercase tracking-wider">
                    Available 20-Minute Times ({activeDayObj?.dateLabel})
                  </span>
                  <span className="text-[11px] font-mono text-tone-muted">
                    Timezone: {timezone}
                  </span>
                </div>

                {activeDayObj?.slots.length === 0 ? (
                  <div className="p-6 text-center bg-[#FAF8F4] border border-[#E4DFD5] rounded-[4px] text-xs text-tone-muted">
                    All consultation slots for this day are fully booked. Please choose an adjacent day above.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {activeDayObj?.slots.map((slot) => {
                      const isSelected = selectedSlot?.startsAtUtc === slot.startsAtUtc;
                      return (
                        <button
                          key={slot.startsAtUtc}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "py-2.5 px-3 border rounded-[4px] text-xs font-sans transition-all text-center cursor-pointer",
                            isSelected
                              ? "bg-gold text-navy font-semibold border-gold shadow-xs"
                              : "bg-white text-tone-heading border-[#E4DFD5] hover:border-gold hover:bg-gold/5"
                          )}
                        >
                          <span className="font-semibold block">{slot.localTime}</span>
                          <span className="text-[10px] text-tone-muted block mt-0.5">
                            {slot.timezoneShort}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Proceed to Step 2 */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E4DFD5]">
                <div className="text-xs text-tone-muted font-sans text-center sm:text-left">
                  {selectedSlot ? (
                    <span>
                      Selected: <strong>{selectedSlot.localDate}</strong> at{" "}
                      <strong>{selectedSlot.localTimeDisplay}</strong>
                    </span>
                  ) : (
                    <span>Please click a time slot above to continue.</span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gold text-navy font-semibold text-xs sm:text-sm rounded-[4px] transition-colors hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                >
                  Continue to Step 2: Your Details &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: DETAILS & TOPIC FOCUS ────────────────────────────────── */}
      {step === 2 && (
        <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 space-y-6">
          {/* Slot Summary Pill */}
          <div className="p-3.5 bg-[#FAF8F4] border border-[#E4DFD5] rounded-[4px] flex items-center justify-between">
            <div className="text-xs font-sans">
              <span className="text-tone-muted block text-[10px] uppercase font-bold text-gold">
                Selected Appointment Time:
              </span>
              <span className="font-semibold text-navy">
                {selectedSlot?.localDate} &bull; {selectedSlot?.localTimeDisplay}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-tone-muted hover:text-navy underline cursor-pointer"
            >
              Change time
            </button>
          </div>

          {/* Conflict Error Notice (Graceful Exclusion Handling) */}
          {errorMessage && (
            <div
              role="alert"
              className="p-4 bg-burgundy/10 border-l-2 border-burgundy rounded-[4px] text-xs font-sans space-y-2"
            >
              <p className="font-semibold text-tone-heading">{errorMessage}</p>
              {conflictSlots.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-burgundy/20">
                  <span className="text-[11px] text-tone-muted block">Next closest available slots:</span>
                  <div className="flex flex-wrap gap-2">
                    {conflictSlots.map((cs) => (
                      <button
                        key={cs.startsAtUtc}
                        type="button"
                        onClick={() => {
                          setSelectedSlot(cs);
                          setConflictSlots([]);
                          setErrorMessage(null);
                        }}
                        className="px-2.5 py-1 bg-white border border-[#E4DFD5] text-navy text-[11px] font-medium rounded-[3px] hover:border-gold"
                      >
                        {cs.localDate.split(",")[0]}, {cs.localTimeDisplay}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Intake Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label htmlFor="full_name" className="text-xs font-medium text-tone-heading block">
                Full name *
              </label>
              <input
                id="full_name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. / Prof. / Candidate Name"
                className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold font-sans"
              />
            </div>

            <div className="space-y-1 text-left">
              <label htmlFor="email" className="text-xs font-medium text-tone-heading block">
                Academic or primary email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scholar@university.edu"
                className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold font-sans"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label htmlFor="study_level" className="text-xs font-medium text-tone-heading block">
              Current study or career level *
            </label>
            <select
              id="study_level"
              value={studyLevel}
              onChange={(e) => setStudyLevel(e.target.value)}
              className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold font-sans"
            >
              <option value="phd">PhD / Doctoral Candidate</option>
              <option value="masters">Master&apos;s by Research</option>
              <option value="undergraduate">Honours / Senior Undergraduate</option>
              <option value="researcher">Postdoctoral Researcher / Faculty</option>
              <option value="other">Independent Scholar / Other</option>
            </select>
          </div>

          <div className="space-y-1 text-left">
            <label htmlFor="topic_help" className="text-xs font-medium text-tone-heading block">
              What do you need help with? *
            </label>
            <input
              id="topic_help"
              type="text"
              required
              value={topicHelp}
              onChange={(e) => setTopicHelp(e.target.value)}
              placeholder="e.g. Chapter 3 methodology alignment, SEM syntax audit, defense preparation"
              className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold font-sans"
            />
          </div>

          <div className="space-y-1 text-left">
            <label htmlFor="message" className="text-xs font-medium text-tone-heading block">
              Optional background or committee context
            </label>
            <textarea
              id="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about software (R, SPSS, Python, Stata), upcoming committee reviews, or specific blockers..."
              className="w-full border border-[#E4DFD5] bg-paper px-3 py-2 text-xs sm:text-sm rounded-[4px] focus:outline-none focus:ring-1 focus:ring-gold font-sans"
            />
          </div>

          {/* Academic Integrity & Free Notice */}
          <div className="p-3.5 bg-[#FAF8F4] border border-[#E4DFD5] rounded-[4px] text-[11px] text-tone-muted font-sans leading-relaxed">
            <strong>Honest Advisory Policy:</strong> This 20-minute call is free with zero obligation. We evaluate your methodology and tell you honestly whether we have the right specialist. We do not write thesis chapters for students.
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E4DFD5]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-tone-muted hover:text-navy font-medium cursor-pointer"
            >
              &larr; Back to time selection
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-2.5 bg-gold text-navy font-semibold text-xs sm:text-sm rounded-[4px] transition-colors hover:bg-gold/90 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? "Confirming Consultation..." : "Confirm Free Consultation &rarr;"}
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 3: CONFIRMATION & CALENDAR ──────────────────────────────── */}
      {step === 3 && confirmedBooking && (
        <div className="p-6 sm:p-10 space-y-6 text-center">
          <div className="w-12 h-12 bg-forest/10 text-forest border border-forest/30 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            &check;
          </div>

          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="font-serif text-2xl font-medium text-tone-heading">
              Your consultation is confirmed
            </h3>
            <p className="text-xs sm:text-sm text-tone-muted font-sans leading-relaxed">
              We have scheduled your 20-minute call and emailed your calendar invite with the Google Meet link.
            </p>
          </div>

          {/* Booking Card Details */}
          <div className="max-w-md mx-auto p-5 bg-[#FAF8F4] border border-[#E4DFD5] rounded-[4px] text-left space-y-3 font-sans">
            <div>
              <span className="text-[10px] uppercase font-bold text-gold block">Appointment Time</span>
              <span className="text-sm font-semibold text-navy">
                {confirmedBooking.localDate} at {confirmedBooking.localTimeDisplay}
              </span>
            </div>

            <div className="pt-2 border-t border-[#E4DFD5]">
              <span className="text-[10px] uppercase font-bold text-tone-muted block">Google Meet Room</span>
              <a
                href={confirmedBooking.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono font-medium text-navy hover:underline break-all"
              >
                {confirmedBooking.meetingUrl}
              </a>
            </div>

            <div className="pt-2 border-t border-[#E4DFD5] text-[11px] text-tone-muted">
              Need to reschedule? You can manage or cancel your booking up to 6 hours before the start via the link in your email, or bookmark this management URL:
              <br />
              <Link
                href={confirmedBooking.manageUrl}
                className="text-navy font-medium underline mt-1 inline-block"
              >
                Self-service booking management page
              </Link>
            </div>
          </div>

          {/* What to bring */}
          <div className="max-w-lg mx-auto text-left p-4 border border-[#E4DFD5] rounded-[4px] space-y-2 font-sans text-xs text-tone-muted">
            <span className="font-semibold text-tone-heading block">How to prepare for the call:</span>
            <ul className="list-disc pl-4 space-y-1">
              <li>Have your research question, methodology outline, or chapter draft open.</li>
              <li>Note down specific software questions (SPSS, R, Python, NVivo, AMOS).</li>
              <li>Be ready to discuss your target submission or committee review dates.</li>
            </ul>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-2 bg-paper border border-[#E4DFD5] text-xs font-semibold text-navy rounded-[4px] hover:bg-white"
            >
              Return to Homepage
            </Link>
            <Link
              href="/services"
              className="px-6 py-2 bg-gold text-navy text-xs font-semibold rounded-[4px] hover:bg-gold/90"
            >
              Explore Research Services &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
