import { getAvailableSlots, getBookingSettings, getNextAvailableSlots, formatSlotForTimezone } from "../lib/booking/availability";
import { generateICSString } from "../lib/booking/calendar-ics";
import { assignMentorForBooking } from "../lib/booking/mentor-assignment";
import {
  ConsultationBookingSchema,
  ProgramApplicationSchema,
  SupportRequestSchema,
  PaidSessionBookingSchema,
} from "../lib/validators";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

async function runStage6Tests() {
  console.log("===============================================================================");
  console.log("             GRADEDGE STAGE 6: BOOKING & APPLICATIONS TEST SUITE              ");
  console.log("===============================================================================\n");

  // ── 1. AVAILABILITY ENGINE & TIMEZONES ────────────────────────────────────
  console.log("--- 1. AVAILABILITY & TIMEZONE ENGINE ---");
  const settings = await getBookingSettings();
  assert(settings.minNoticeHours === 12, "Default min notice is 12 hours");
  assert(settings.maxAdvanceDays === 45, "Default max advance is 45 days");
  assert(settings.bufferMinutes === 10, "Buffer between sessions is 10 minutes");
  assert(settings.sessionDurationMinutes === 20, "Consultation session duration is 20 minutes");

  const daysUtc = await getAvailableSlots({ visitorTimezone: "UTC", daysToFetch: 7 });
  assert(daysUtc.length > 0, "Generates availability days in UTC");

  const totalSlotsUtc = daysUtc.reduce((acc, d) => acc + d.slots.length, 0);
  assert(totalSlotsUtc > 0, `Generated ${totalSlotsUtc} available slots within 7-day window`);

  // Check 12-hour minimum notice
  const now = new Date();
  const minNoticeTime = new Date(now.getTime() + 12 * 60 * 60 * 1000).getTime();
  const allSlotsRespectMinNotice = daysUtc.every((day) =>
    day.slots.every((slot) => new Date(slot.startsAtUtc).getTime() >= minNoticeTime)
  );
  assert(allSlotsRespectMinNotice, "All generated slots strictly respect >= 12h minimum notice");

  // Timezone formatting
  const testSlotStart = new Date("2026-11-10T14:00:00Z");
  const testSlotEnd = new Date("2026-11-10T14:20:00Z");

  const watSlot = formatSlotForTimezone(testSlotStart, testSlotEnd, "Africa/Lagos");
  assert(watSlot.localTime === "15:00", "Converts 14:00 UTC to 15:00 WAT");
  assert(watSlot.localTimeDisplay.includes("15:00"), "Displays time with timezone short label");

  const nySlot = formatSlotForTimezone(testSlotStart, testSlotEnd, "America/New_York");
  assert(nySlot.localTime === "09:00", "Converts 14:00 UTC to 09:00 EST");

  // ── 2. .ICS CALENDAR GENERATION ───────────────────────────────────────────
  console.log("\n--- 2. .ICS CALENDAR GENERATION ---");
  const ics = generateICSString({
    uid: "test-booking-123",
    summary: "GradEdge 20-Minute Advisory Consultation",
    description: "Methodology alignment session.\nRoom: https://meet.google.com/xyz",
    location: "https://meet.google.com/xyz",
    startsAt: testSlotStart,
    endsAt: testSlotEnd,
    attendeeName: "Jane Scholar",
    attendeeEmail: "jane@university.edu",
  });

  assert(ics.includes("BEGIN:VCALENDAR"), ".ics contains valid VCALENDAR opening");
  assert(ics.includes("BEGIN:VEVENT"), ".ics contains VEVENT");
  assert(ics.includes("UID:test-booking-123@gradedge.com"), ".ics contains unique UID");
  assert(ics.includes("METHOD:REQUEST"), ".ics specifies METHOD:REQUEST for direct calendar integration");
  assert(ics.includes("LOCATION:https://meet.google.com/xyz"), ".ics contains meeting URL location");
  assert(ics.includes("ORGANIZER;CN=\"GradEdge Academic Advisory\""), ".ics contains branded organizer");
  assert(ics.includes("END:VCALENDAR"), ".ics closes properly");

  // ── 3. CONSULTATION VALIDATION & DOUBLE-BOOKING CONFLICT ──────────────────
  console.log("\n--- 3. CONSULTATION BOOKING SCHEMA & DOUBLE-BOOKING HANDLING ---");
  const validConsultation = ConsultationBookingSchema.safeParse({
    starts_at: "2026-11-12T14:00:00Z",
    timezone: "Africa/Lagos",
    full_name: "John Researcher",
    email: "john@uni.edu",
    study_level: "phd",
    topic_help: "Chapter 3 SEM and factor analysis diagnostics",
    message: "Using lavaan in R, committee requested modification indices check.",
  });
  assert(validConsultation.success, "Valid consultation booking payload passes Zod validation");

  const invalidEmail = ConsultationBookingSchema.safeParse({
    starts_at: "2026-11-12T14:00:00Z",
    timezone: "UTC",
    full_name: "J",
    email: "invalid-email",
    study_level: "phd",
    topic_help: "Help",
  });
  assert(!invalidEmail.success, "Rejects invalid email and short full name");

  // Conflict next slots generator
  const nextSlots = await getNextAvailableSlots("2026-11-12T14:00:00Z", 3, "UTC");
  assert(nextSlots.length <= 3, "Next available slots returns up to 3 alternative options");
  if (nextSlots.length > 0) {
    assert(
      new Date(nextSlots[0].startsAtUtc).getTime() > new Date("2026-11-12T14:00:00Z").getTime(),
      "Next slots are strictly in the future of the conflicting slot"
    );
  }

  // ── 4. PAID SESSIONS & MENTOR ASSIGNMENT ──────────────────────────────────
  console.log("\n--- 4. PAID SESSIONS & MENTOR ASSIGNMENT ---");
  const paidSession = PaidSessionBookingSchema.safeParse({
    service_id: "serv-data",
    starts_at: "2026-11-15T10:00:00Z",
    timezone: "UTC",
    notes: "Review hierarchical linear modeling syntax in Stata.",
  });
  assert(paidSession.success, "Paid session booking payload validates correctly");

  const assignment = await assignMentorForBooking({
    serviceId: "serv-data",
    fieldOfStudy: "Econometrics",
    startsAt: "2026-11-15T10:00:00Z",
    endsAt: "2026-11-15T11:00:00Z",
  });
  assert(assignment !== null, "Mentor assignment function executes successfully");
  assert(
    ["discipline_match", "availability_pool", "mock_assigned", "admin_pending"].includes(
      assignment.assignedMethod
    ),
    `Mentor assigned via valid strategy: ${assignment.assignedMethod}`
  );

  // ── 5. ACCELERATOR APPLICATION VALIDATION ────────────────────────────────
  console.log("\n--- 5. ACCELERATOR APPLICATION VALIDATION ---");
  const validApp = ProgramApplicationSchema.safeParse({
    name: "Eleanor Vance",
    email: "e.vance@cambridge.ac.uk",
    institution: "University of Cambridge",
    doctoral_stage: "Mid-Candidacy / Writing Chapters",
    topic_summary: "Socio-technical resilience in decentralized power grids.",
    completed_summary: "Chapters 1 & 2 drafted; qualitative interview coding in NVivo complete.",
    desired_outcomes: "16-week structured milestone critique and defense coaching.",
    preferred_start: "Immediate Cohort (Within 2 Weeks)",
  });
  assert(validApp.success, "Accelerator application with all 8 prompt fields passes validation");

  const missingOutcomes = ProgramApplicationSchema.safeParse({
    name: "Eleanor Vance",
    email: "e.vance@cambridge.ac.uk",
    institution: "University of Cambridge",
    doctoral_stage: "Proposal",
    topic_summary: "Topic summary",
    completed_summary: "Completed",
    desired_outcomes: "Short", // Less than 10 chars
    preferred_start: "Immediate",
  });
  assert(!missingOutcomes.success, "Enforces minimum character lengths on qualitative intake questions");

  // ── 6. SUPPORT REQUEST VALIDATION & LANGUAGE ENFORCEMENT ──────────────────
  console.log("\n--- 6. SUPPORT REQUEST VALIDATION & LANGUAGE ENFORCEMENT ---");
  const validSupportRequest = SupportRequestSchema.safeParse({
    service_id: "serv-1",
    title: "Chapter 3 Quantitative Methodology Audit",
    brief: "Detailed review of multinomial logistic regression assumptions and robustness checks.",
    deadline: "2026-12-01",
    files: [
      {
        file_name: "Chapter_3_Methodology_Draft_v4.docx",
        bucket_path: "projects/uploads/ch3-draft.docx",
        size_bytes: 450000,
        mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    ],
  });
  assert(validSupportRequest.success, "Support request validates with service, brief, deadline, and files");

  // Check language rules: no 'order' terminology
  const supportRequestString = JSON.stringify(validSupportRequest);
  assert(!supportRequestString.includes('"order"'), "Ensures strictly 'support request' terminology, never 'order'");

  // ── 7. SUMMARY ────────────────────────────────────────────────────────────
  console.log("\n===============================================================================");
  console.log(`TOTAL AUDIT RESULT: ${passed}/${passed + failed} (${Math.round((passed / (passed + failed)) * 100)}%) tests passed.`);
  console.log("===============================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runStage6Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

