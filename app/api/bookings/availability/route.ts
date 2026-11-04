import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots, getBookingSettings } from "@/lib/booking/availability";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timezone = searchParams.get("timezone") || "UTC";
    const daysParam = parseInt(searchParams.get("days") || "14", 10);
    const mentorId = searchParams.get("mentorId") || undefined;

    const [days, settings] = await Promise.all([
      getAvailableSlots({
        visitorTimezone: timezone,
        daysToFetch: isNaN(daysParam) ? 14 : daysParam,
        mentorId,
      }),
      getBookingSettings(),
    ]);

    return NextResponse.json({
      days,
      settings,
      timezone,
    });
  } catch (error) {
    console.error("[Availability API Error]", error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

