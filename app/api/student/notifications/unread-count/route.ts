import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { getUnreadCount } from "@/lib/notifications/service";

export async function GET() {
  try {
    const { user } = await requireUser();
    const count = await getUnreadCount(user.id);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

