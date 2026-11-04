import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/server";
import { processPaymentRefund } from "@/lib/payments/service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireRole(["admin"]);
    const { id } = await params;

    const body = await req.json();
    const { reason, amountMinor } = body;

    if (!reason || reason.trim().length < 5) {
      return NextResponse.json(
        { error: "A detailed refund reason (at least 5 characters) is required for audit compliance." },
        { status: 400 }
      );
    }

    const result = await processPaymentRefund({
      paymentId: id,
      amountMinor: amountMinor ? Number(amountMinor) : undefined,
      reason: reason.trim(),
      adminId: user.id,
    });

    return NextResponse.json({
      success: true,
      refundId: result.refundId,
      amountRefundedMinor: result.amountRefundedMinor,
    });
  } catch (error: any) {
    console.error("[Admin Payment Refund Error]", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute refund." },
      { status: error.status || 500 }
    );
  }
}

