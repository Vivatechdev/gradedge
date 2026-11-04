import { createServiceRoleClient } from "@/lib/supabase/service-role";

export interface BookingSettings {
  minNoticeHours: number;
  maxAdvanceDays: number;
  bufferMinutes: number;
  sessionDurationMinutes: number;
  defaultMeetingUrl: string;
}

export const DEFAULT_BOOKING_SETTINGS: BookingSettings = {
  minNoticeHours: 12,
  maxAdvanceDays: 45,
  bufferMinutes: 10,
  sessionDurationMinutes: 20,
  defaultMeetingUrl: "https://meet.google.com/lookup/gradedge-consultation",
};

export interface TimeSlot {
  startsAtUtc: string;
  endsAtUtc: string;
  localDate: string;
  localDateIso: string;
  localTime: string;
  localTimeDisplay: string;
  timezone: string;
  timezoneShort: string;
}

export interface DaySlots {
  dateIso: string;
  dateLabel: string;
  slots: TimeSlot[];
}

export async function getBookingSettings(): Promise<BookingSettings> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return DEFAULT_BOOKING_SETTINGS;
  }

  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase.from("settings").select("key, value");

    if (!data || data.length === 0) {
      return DEFAULT_BOOKING_SETTINGS;
    }

    const settingsMap = new Map(data.map((item) => [item.key, item.value]));

    return {
      minNoticeHours: Number(settingsMap.get("booking_min_notice_hours")) || DEFAULT_BOOKING_SETTINGS.minNoticeHours,
      maxAdvanceDays: Number(settingsMap.get("booking_max_advance_days")) || DEFAULT_BOOKING_SETTINGS.maxAdvanceDays,
      bufferMinutes: Number(settingsMap.get("booking_buffer_minutes")) || DEFAULT_BOOKING_SETTINGS.bufferMinutes,
      sessionDurationMinutes: DEFAULT_BOOKING_SETTINGS.sessionDurationMinutes,
      defaultMeetingUrl:
        (settingsMap.get("booking_default_meeting_url") as string) || DEFAULT_BOOKING_SETTINGS.defaultMeetingUrl,
    };
  } catch (err) {
    console.warn("[BookingSettings] Falling back to defaults:", err);
    return DEFAULT_BOOKING_SETTINGS;
  }
}

interface GenerateSlotsOptions {
  visitorTimezone?: string;
  daysToFetch?: number;
  mentorId?: string;
}

export async function getAvailableSlots(options: GenerateSlotsOptions = {}): Promise<DaySlots[]> {
  const visitorTimezone = options.visitorTimezone || "UTC";
  const daysToFetch = Math.min(options.daysToFetch || 14, 45);
  const settings = await getBookingSettings();

  const now = new Date();
  const minNoticeDate = new Date(now.getTime() + settings.minNoticeHours * 60 * 60 * 1000);
  const maxAdvanceDate = new Date(now.getTime() + settings.maxAdvanceDays * 24 * 60 * 60 * 1000);

  // Default rules (Mon-Fri 09:00 - 17:00 UTC) if DB empty
  const defaultRules = [1, 2, 3, 4, 5].map((weekday) => ({
    weekday,
    start_time: "09:00:00",
    end_time: "17:00:00",
  }));

  let rules = defaultRules;
  let exceptions: Array<{ date: string; is_unavailable: boolean; start_time?: string; end_time?: string }> = [];
  let existingBookings: Array<{ starts_at: string; ends_at: string }> = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createServiceRoleClient();

      // Fetch availability rules
      let rulesQuery = supabase.from("availability_rules").select("*");
      if (options.mentorId) {
        rulesQuery = rulesQuery.or(`mentor_id.eq.${options.mentorId},mentor_id.is.null`);
      }
      const { data: dbRules } = await rulesQuery;
      if (dbRules && dbRules.length > 0) {
        rules = dbRules;
      }

      // Fetch exceptions in range
      const { data: dbExceptions } = await supabase
        .from("availability_exceptions")
        .select("*")
        .gte("date", now.toISOString().slice(0, 10))
        .lte("date", maxAdvanceDate.toISOString().slice(0, 10));
      if (dbExceptions) {
        exceptions = dbExceptions;
      }

      // Fetch existing bookings in range (excluding cancelled or expired pending_payment)
      const { data: dbBookings } = await supabase
        .from("bookings")
        .select("starts_at, ends_at, status, expires_at")
        .gte("ends_at", minNoticeDate.toISOString())
        .lte("starts_at", maxAdvanceDate.toISOString())
        .or(
          "status.eq.confirmed,and(status.eq.pending_payment,expires_at.gt.now()),and(status.eq.pending_payment,expires_at.is.null)"
        );

      if (dbBookings) {
        existingBookings = dbBookings;
      }
    } catch (err) {
      console.warn("[AvailabilityEngine] DB lookup failed, proceeding with standard slots:", err);
    }
  }

  const stepMinutes = settings.sessionDurationMinutes + settings.bufferMinutes; // 30 mins
  const daySlotsMap = new Map<string, TimeSlot[]>();

  // Iterate over each day in requested window
  for (let i = 0; i < daysToFetch; i++) {
    const targetDay = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const dayIso = targetDay.toISOString().slice(0, 10);
    const weekday = targetDay.getUTCDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

    // Check if entire day is unavailable exception
    const fullDayException = exceptions.find((ex) => ex.date === dayIso && ex.is_unavailable && !ex.start_time);
    if (fullDayException) continue;

    // Find rules for this weekday
    const dayRules = rules.filter((r) => r.weekday === weekday);
    if (dayRules.length === 0) continue;

    for (const rule of dayRules) {
      const [startH, startM] = rule.start_time.split(":").map(Number);
      const [endH, endM] = rule.end_time.split(":").map(Number);

      const ruleStart = new Date(Date.UTC(targetDay.getUTCFullYear(), targetDay.getUTCMonth(), targetDay.getUTCDate(), startH, startM, 0));
      const ruleEnd = new Date(Date.UTC(targetDay.getUTCFullYear(), targetDay.getUTCMonth(), targetDay.getUTCDate(), endH, endM, 0));

      let currentSlotStart = new Date(ruleStart.getTime());

      while (currentSlotStart.getTime() + settings.sessionDurationMinutes * 60 * 1000 <= ruleEnd.getTime()) {
        const currentSlotEnd = new Date(currentSlotStart.getTime() + settings.sessionDurationMinutes * 60 * 1000);

        // Verify minimum notice & maximum advance
        if (currentSlotStart >= minNoticeDate && currentSlotStart <= maxAdvanceDate) {
          // Check collision with existing bookings
          const hasCollision = existingBookings.some((b) => {
            const bStart = new Date(b.starts_at).getTime();
            const bEnd = new Date(b.ends_at).getTime();
            const sStart = currentSlotStart.getTime();
            const sEnd = currentSlotEnd.getTime();
            // Overlap check [sStart, sEnd) with [bStart, bEnd)
            return sStart < bEnd && sEnd > bStart;
          });

          if (!hasCollision) {
            // Format slot in visitor timezone
            const timeSlot = formatSlotForTimezone(currentSlotStart, currentSlotEnd, visitorTimezone);

            const dayGroupKey = timeSlot.localDateIso;
            if (!daySlotsMap.has(dayGroupKey)) {
              daySlotsMap.set(dayGroupKey, []);
            }
            daySlotsMap.get(dayGroupKey)!.push(timeSlot);
          }
        }

        // Advance by duration + buffer (30 minutes)
        currentSlotStart = new Date(currentSlotStart.getTime() + stepMinutes * 60 * 1000);
      }
    }
  }

  // Format into DaySlots array sorted by date
  const result: DaySlots[] = Array.from(daySlotsMap.entries())
    .map(([dateIso, slots]) => ({
      dateIso,
      dateLabel: slots[0]?.localDate || dateIso,
      slots: slots.sort((a, b) => new Date(a.startsAtUtc).getTime() - new Date(b.startsAtUtc).getTime()),
    }))
    .sort((a, b) => a.dateIso.localeCompare(b.dateIso));

  return result;
}

export function formatSlotForTimezone(startUtc: Date, endUtc: Date, timezone: string): TimeSlot {
  try {
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const isoDateFormatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const shortTimezoneFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    });

    const timeParts = shortTimezoneFormatter.formatToParts(startUtc);
    const shortTz = timeParts.find((p) => p.type === "timeZoneName")?.value || timezone;

    const localTime = timeFormatter.format(startUtc);
    const localDate = dateFormatter.format(startUtc);
    const localDateIso = isoDateFormatter.format(startUtc);

    return {
      startsAtUtc: startUtc.toISOString(),
      endsAtUtc: endUtc.toISOString(),
      localDate,
      localDateIso,
      localTime,
      localTimeDisplay: `${localTime} (${shortTz})`,
      timezone,
      timezoneShort: shortTz,
    };
  } catch {
    // Fallback if timezone is invalid
    return {
      startsAtUtc: startUtc.toISOString(),
      endsAtUtc: endUtc.toISOString(),
      localDate: startUtc.toUTCString().slice(0, 16),
      localDateIso: startUtc.toISOString().slice(0, 10),
      localTime: startUtc.toISOString().slice(11, 16),
      localTimeDisplay: `${startUtc.toISOString().slice(11, 16)} (UTC)`,
      timezone: "UTC",
      timezoneShort: "UTC",
    };
  }
}

/**
 * Find next available slots after a collision or chosen time
 */
export async function getNextAvailableSlots(
  afterUtc: string,
  count: number = 3,
  timezone: string = "UTC"
): Promise<TimeSlot[]> {
  const allDays = await getAvailableSlots({ visitorTimezone: timezone, daysToFetch: 21 });
  const afterTime = new Date(afterUtc).getTime();

  const flatSlots: TimeSlot[] = [];
  for (const day of allDays) {
    for (const slot of day.slots) {
      if (new Date(slot.startsAtUtc).getTime() > afterTime) {
        flatSlots.push(slot);
        if (flatSlots.length >= count) {
          return flatSlots;
        }
      }
    }
  }

  return flatSlots;
}

