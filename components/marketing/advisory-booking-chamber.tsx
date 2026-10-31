"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle2, ShieldCheck, User, Mail, GraduationCap } from "lucide-react";

const AVAILABLE_DATES = [
  { id: "date-1", label: "Tomorrow", dateString: "Thursday, Nov 05", slotsCount: 3 },
  { id: "date-2", label: "Friday", dateString: "Friday, Nov 06", slotsCount: 4 },
  { id: "date-3", label: "Monday", dateString: "Monday, Nov 09", slotsCount: 5 },
  { id: "date-4", label: "Tuesday", dateString: "Tuesday, Nov 10", slotsCount: 3 },
];

const TIME_SLOTS = [
  { time: "10:00 AM WAT", period: "Morning" },
  { time: "11:30 AM WAT", period: "Morning" },
  { time: "02:00 PM WAT", period: "Afternoon" },
  { time: "03:30 PM WAT", period: "Afternoon" },
  { time: "05:00 PM WAT", period: "Late Afternoon" },
];

export function AdvisoryBookingChamber() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("date-1");
  const [selectedTime, setSelectedTime] = useState("02:00 PM WAT");
  const [researchField, setResearchField] = useState("dissertation");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeDateObj = AVAILABLE_DATES.find((d) => d.id === selectedDate) || AVAILABLE_DATES[0];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push(
        `/book/confirmed?date=${encodeURIComponent(activeDateObj.dateString)}&time=${encodeURIComponent(
          selectedTime
        )}&field=${encodeURIComponent(researchField)}`
      );
    }, 600);
  };

  return (
    <div className="border border-tone-rule bg-white rounded-[2px] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-tone-rule pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gold" />
            <span className="type-micro text-gold">Advisory Dispatch</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-tone-heading font-medium">
            Schedule Your Confidential 20-Minute Advisory Call
          </h3>
          <p className="text-xs text-tone-muted">
            All consultations are conducted via Google Meet with a doctoral research advisor.
          </p>
        </div>

        <Badge variant="navy">Verified Slot Availability</Badge>
      </div>

      <form onSubmit={handleBookingSubmit} className="space-y-6">
        {/* Step 1: Select Date */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-tone-heading block">
            1. Select Day:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AVAILABLE_DATES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDate(d.id)}
                className={`p-3 text-left border rounded-[2px] text-xs transition-colors cursor-pointer ${
                  selectedDate === d.id
                    ? "border-navy bg-navy/5 text-navy font-semibold shadow-xs"
                    : "border-tone-rule bg-paper text-tone-body hover:border-tone-heading"
                }`}
              >
                <span className="block font-medium text-tone-heading">{d.label}</span>
                <span className="text-[11px] text-tone-muted block">{d.dateString.split(",")[1]}</span>
                <span className="text-[10px] text-gold font-mono block mt-1">{d.slotsCount} open slots</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Time Slot */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-tone-heading block">
            2. Select Time (West Africa Time / UTC+1):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {TIME_SLOTS.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedTime(t.time)}
                className={`p-2.5 text-center border rounded-[2px] text-xs transition-colors cursor-pointer ${
                  selectedTime === t.time
                    ? "border-navy bg-navy text-white font-semibold shadow-xs"
                    : "border-tone-rule bg-white text-tone-body hover:border-navy"
                }`}
              >
                <Clock className="w-3.5 h-3.5 mx-auto mb-1 opacity-70" />
                <span className="block text-[11px] font-mono">{t.time}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Primary Bottleneck */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-tone-heading block">
            3. Primary Research Focus:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setResearchField("dissertation")}
              className={`p-3 text-left border rounded-[2px] transition-colors cursor-pointer ${
                researchField === "dissertation"
                  ? "border-navy bg-navy/5 text-navy font-semibold"
                  : "border-tone-rule bg-paper text-tone-muted hover:border-tone-heading"
              }`}
            >
              Dissertation & Thesis Architecture
            </button>
            <button
              type="button"
              onClick={() => setResearchField("data-analysis")}
              className={`p-3 text-left border rounded-[2px] transition-colors cursor-pointer ${
                researchField === "data-analysis"
                  ? "border-navy bg-navy/5 text-navy font-semibold"
                  : "border-tone-rule bg-paper text-tone-muted hover:border-tone-heading"
              }`}
            >
              Data Analysis & Statistical Audits
            </button>
            <button
              type="button"
              onClick={() => setResearchField("viva-defense")}
              className={`p-3 text-left border rounded-[2px] transition-colors cursor-pointer ${
                researchField === "viva-defense"
                  ? "border-navy bg-navy/5 text-navy font-semibold"
                  : "border-tone-rule bg-paper text-tone-muted hover:border-tone-heading"
              }`}
            >
              Oral Defense / Viva Preparation
            </button>
          </div>
        </div>

        {/* Step 4: Candidate Contact Info */}
        <div className="space-y-3 pt-2 border-t border-tone-rule">
          <label className="text-xs font-semibold uppercase tracking-wider text-tone-heading block">
            4. Candidate Details:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[11px] text-tone-muted block mb-1">Your Full Name *</span>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Freedom Sola"
                  className="w-full text-xs px-3 py-2 border border-tone-rule bg-paper rounded-[2px] text-tone-heading focus:outline-2 focus:outline-navy"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-tone-muted block mb-1">University Email *</span>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="candidate@university.edu"
                  className="w-full text-xs px-3 py-2 border border-tone-rule bg-paper rounded-[2px] text-tone-heading focus:outline-2 focus:outline-navy"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-tone-muted block mb-1">University / Department</span>
              <div className="relative">
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Public Health / Oxford"
                  className="w-full text-xs px-3 py-2 border border-tone-rule bg-paper rounded-[2px] text-tone-heading focus:outline-2 focus:outline-navy"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] text-tone-muted">
            <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
            <span>Strict academic confidentiality. Your draft and topics are never shared publicly.</span>
          </div>

          <Button
            type="submit"
            variant="accent"
            size="lg"
            isLoading={isSubmitting}
            className="w-full sm:w-auto font-semibold"
          >
            Confirm 20-Min Advisory Call &rarr;
          </Button>
        </div>
      </form>
    </div>
  );
}
