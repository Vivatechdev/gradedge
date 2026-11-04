/**
 * RFC 5545 iCalendar (.ics) Generator
 * Creates standards-compliant calendar files compatible with Google Calendar,
 * Apple Calendar, Microsoft Outlook, and mobile devices.
 */

interface CalendarEventOptions {
  uid: string;
  summary: string;
  description: string;
  location?: string;
  startsAt: Date;
  endsAt: Date;
  organizerName?: string;
  organizerEmail?: string;
  attendeeName?: string;
  attendeeEmail?: string;
}

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function generateICSString(event: CalendarEventOptions): string {
  const dtStamp = formatICSDate(new Date());
  const dtStart = formatICSDate(event.startsAt);
  const dtEnd = formatICSDate(event.endsAt);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GradEdge Academic Solutions//Advisory Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${event.uid}@gradedge.com`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeICS(event.summary)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,
  ];

  if (event.location) {
    lines.push(`LOCATION:${escapeICS(event.location)}`);
  }

  const organizerName = event.organizerName || "GradEdge Academic Advisory";
  const organizerEmail = event.organizerEmail || "support@gradedge.com";
  lines.push(`ORGANIZER;CN="${escapeICS(organizerName)}":mailto:${organizerEmail}`);

  if (event.attendeeEmail) {
    const attendeeName = event.attendeeName || event.attendeeEmail;
    lines.push(
      `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN="${escapeICS(
        attendeeName
      )}":mailto:${event.attendeeEmail}`
    );
  }

  lines.push("STATUS:CONFIRMED");
  lines.push("SEQUENCE:0");
  lines.push("TRANSP:OPAQUE");
  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
}

function escapeICS(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

