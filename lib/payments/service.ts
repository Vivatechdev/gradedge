import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { paymentProvider } from "./paystack";
import {
  Currency,
  PaymentPurpose,
  formatMoney,
  splitInstallments,
} from "./types";
import { generateInvoicePdfBuffer, InvoiceItem } from "./invoice-pdf";
import { getServiceBySlug, SERVICES_CONTENT, ServicePackage } from "@/lib/data/services-content";
import { sendPaymentReceiptEmail, sendRefundConfirmationEmail, sendBookingConfirmationEmail } from "@/lib/email";
import { generateICSString } from "@/lib/booking/calendar-ics";
import { assignMentorForBooking } from "@/lib/booking/mentor-assignment";

export interface PriceLookupParams {
  purpose: PaymentPurpose;
  currency: Currency;
  packageId?: string;
  serviceSlug?: string;
  planId?: string;
  isInstallment?: boolean;
  installmentNumber?: number;
  installmentTotal?: number;
}

export interface PriceLookupResult {
  amountMinor: number;
  currency: Currency;
  title: string;
  description: string;
  items: InvoiceItem[];
  metadata: Record<string, unknown>;
}

/**
 * Server-Side Price Lookup
 * Rule 9: Never accept a price from the client.
 * All prices are strictly determined and verified on the server.
 */
export async function lookupPrice(params: PriceLookupParams): Promise<PriceLookupResult> {
  const { purpose, currency } = params;

  // 1. Paid Session Booking (60-minute one-on-one consultation/tutoring)
  if (purpose === "booking") {
    const amountMinor = currency === "USD" ? 7500 : 3500000; // $75.00 or ₦35,000
    const title = "Paid Academic Mentoring Session (60 mins)";
    const description = "One-on-one doctoral consultation, thesis critique, or methodology review.";
    return {
      amountMinor,
      currency,
      title,
      description,
      items: [{ description: title, quantity: 1, amountMinor }],
      metadata: { session_duration_minutes: 60, service_slug: params.serviceSlug },
    };
  }

  // 2. Academic Package
  if (purpose === "package") {
    let matchedPackage = null;
    let serviceTitle = "Academic Mentoring";

    if (params.serviceSlug) {
      const svc = getServiceBySlug(params.serviceSlug);
      if (svc) {
        serviceTitle = svc.title;
        matchedPackage = svc.packages.find(
          (p) => p.id === params.packageId || p.name.toLowerCase() === params.packageId?.toLowerCase()
        );
      }
    }

    if (!matchedPackage) {
      // Search all services
      for (const svc of Object.values(SERVICES_CONTENT)) {
        const p = svc.packages.find(
          (pkg: ServicePackage) => pkg.id === params.packageId || pkg.name.toLowerCase() === params.packageId?.toLowerCase()
        );
        if (p) {
          matchedPackage = p;
          serviceTitle = svc.title;
          break;
        }
      }
    }

    if (!matchedPackage) {
      throw new Error(`Package '${params.packageId}' not found for pricing verification.`);
    }

    const amountMinor =
      currency === "USD" ? matchedPackage.price_usd * 100 : matchedPackage.price_ngn * 100;

    const title = `${serviceTitle} — ${matchedPackage.name}`;
    const description = matchedPackage.description;

    return {
      amountMinor,
      currency,
      title,
      description,
      items: [{ description: `${matchedPackage.name} (${serviceTitle})`, quantity: 1, amountMinor }],
      metadata: {
        package_id: matchedPackage.id,
        package_name: matchedPackage.name,
        service_slug: params.serviceSlug,
        turnaround: matchedPackage.turnaround,
        rounds_of_feedback: matchedPackage.rounds_of_feedback,
      },
    };
  }

  // 3. Accelerator Program (Full or Installments)
  if (purpose === "program") {
    const totalMinor = currency === "USD" ? 120000 : 120000000; // $1,200 or ₦1,200,000
    const installmentTotal = params.installmentTotal || 3;
    const isInstallment = Boolean(params.isInstallment);

    if (isInstallment) {
      const parts = splitInstallments(totalMinor, installmentTotal);
      const installmentNum = Math.max(1, Math.min(params.installmentNumber || 1, installmentTotal));
      const partAmountMinor = parts[installmentNum - 1];
      const title = `12-Week Doctoral Accelerator (Installment ${installmentNum} of ${installmentTotal})`;
      const description = `Milestone payment for comprehensive doctoral dissertation accelerator cohort.`;

      return {
        amountMinor: partAmountMinor,
        currency,
        title,
        description,
        items: [{ description: title, quantity: 1, amountMinor: partAmountMinor }],
        metadata: {
          program: "accelerator",
          is_installment: true,
          installment_number: installmentNum,
          installment_total: installmentTotal,
          full_program_total_minor: totalMinor,
        },
      };
    } else {
      const title = "12-Week Doctoral Research Accelerator (Full Tuition)";
      const description = "Comprehensive 12-week dissertation writing, methodology, and defense cohort.";
      return {
        amountMinor: totalMinor,
        currency,
        title,
        description,
        items: [{ description: title, quantity: 1, amountMinor: totalMinor }],
        metadata: {
          program: "accelerator",
          is_installment: false,
          installment_number: 1,
          installment_total: 1,
          full_program_total_minor: totalMinor,
        },
      };
    }
  }

  // 4. Membership Plans
  if (purpose === "membership") {
    const planKey = (params.planId || "scholar").toLowerCase();
    const isFellow = planKey.includes("fellow") || planKey.includes("doctoral");

    let amountMinor: number;
    let title: string;
    let description: string;

    if (isFellow) {
      amountMinor = currency === "USD" ? 18000 : 8500000; // $180.00 or ₦85,000
      title = `Doctoral Fellow Membership (${currency})`;
      description = "Bi-weekly 60-minute video coaching, developmental reviews, syntax audits, pre-defense mock viva.";
    } else {
      amountMinor = currency === "USD" ? 9500 : 4500000; // $95.00 or ₦45,000
      title = `Scholar Membership (${currency})`;
      description = "Up to 2 written draft critiques per month, dedicated discipline advisor, monthly 60-min methodology call.";
    }

    return {
      amountMinor,
      currency,
      title,
      description,
      items: [{ description: title, quantity: 1, amountMinor }],
      metadata: {
        tier: isFellow ? "fellow" : "scholar",
        plan_id: params.planId,
        interval: "month",
      },
    };
  }

  throw new Error(`Unsupported payment purpose: ${purpose}`);
}

/**
 * Creates an initiated payment record in the database
 */
export async function createPaymentRecord({
  userId,
  customerEmail,
  customerName,
  purpose,
  currency,
  amountMinor,
  reference,
  relatedId,
  metadata,
}: {
  userId?: string | null;
  customerEmail: string;
  customerName: string;
  purpose: PaymentPurpose;
  currency: Currency;
  amountMinor: number;
  reference: string;
  relatedId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("payments")
    .insert({
      user_id: userId || null,
      customer_email: customerEmail,
      customer_name: customerName,
      provider: "paystack",
      provider_reference: reference,
      amount_minor: amountMinor,
      currency,
      status: "initiated",
      purpose,
      related_id: relatedId || null,
      metadata: metadata || {},
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create payment record: ${error.message}`);
  }

  // Log initiated attempt to audit_log
  await supabase.from("audit_log").insert({
    actor_id: userId || null,
    action: "payment_initiated",
    entity: "payment",
    entity_id: data.id,
    metadata: {
      reference,
      purpose,
      currency,
      amount_minor: amountMinor,
    },
  });

  return data;
}

/**
 * Handles Successful Payment (Idempotent)
 * Used by both the server verification return route and the Paystack webhook.
 */
export async function processPaymentSuccess({
  providerReference,
  rawPayload,
}: {
  providerReference: string;
  rawPayload?: Record<string, unknown>;
}) {
  const supabase = createServiceRoleClient();

  // 1. Fetch payment record
  const { data: payment, error: fetchErr } = await supabase
    .from("payments")
    .select("*")
    .eq("provider_reference", providerReference)
    .single();

  if (fetchErr || !payment) {
    throw new Error(`Payment record with reference '${providerReference}' not found.`);
  }

  // IDEMPOTENCY CHECK: If already succeeded, return immediately
  if (payment.status === "succeeded") {
    return { success: true, payment, idempotent: true };
  }

  const now = new Date().toISOString();

  // 2. Mark payment as succeeded
  const { error: updateErr } = await supabase
    .from("payments")
    .update({
      status: "succeeded",
      paid_at: now,
      raw_payload: rawPayload || {},
    })
    .eq("id", payment.id);

  if (updateErr) {
    throw new Error(`Failed to update payment status: ${updateErr.message}`);
  }

  // 3. Fetch business details for invoicing from settings
  const { data: settingsRows } = await supabase.from("settings").select("key, value");
  const settingsMap = new Map((settingsRows || []).map((r) => [r.key, r.value]));

  const businessDetails = {
    legalName: (settingsMap.get("business_legal_name") as string) || "GradEdge Academic Solutions Ltd",
    address:
      (settingsMap.get("business_address") as string) ||
      "Level 4, Academic Innovation Hub, Victoria Island, Lagos & Oxford Desk",
    taxId: (settingsMap.get("business_tax_id") as string) || "TIN-GE-2026-9481",
    financeEmail: (settingsMap.get("business_finance_email") as string) || "finance@gradedge.com",
    phone: (settingsMap.get("business_phone") as string) || "+234 1 800 GRADEDGE",
    refundPolicyUrl:
      (settingsMap.get("refund_policy_url") as string) || "https://gradedge.com/legal/terms#refunds",
  };

  // 4. Create sequential invoice record (GE-YYYY-0001 auto-generated by DB trigger)
  const items: InvoiceItem[] = payment.metadata?.items || [
    {
      description: `${payment.purpose.toUpperCase()} — ${payment.metadata?.title || "Academic Mentoring"}`,
      quantity: 1,
      amountMinor: payment.amount_minor,
    },
  ];

  const { data: invoice, error: invoiceErr } = await supabase
    .from("invoices")
    .insert({
      payment_id: payment.id,
      currency: payment.currency,
      amount_minor: payment.amount_minor,
      customer_name: payment.customer_name || "Academic Candidate",
      customer_email: payment.customer_email || "scholar@gradedge.com",
      items,
    })
    .select()
    .single();

  if (invoiceErr) {
    console.error("[Invoicing Error]", invoiceErr);
  }

  const invoiceNumber = invoice?.number || `GE-${new Date().getFullYear()}-0001`;

  // 5. Generate PDF invoice in brand style
  let pdfBuffer: Buffer | undefined;
  let pdfUrl: string | undefined;

  try {
    pdfBuffer = generateInvoicePdfBuffer({
      invoiceNumber,
      issuedAt: now,
      currency: payment.currency as Currency,
      amountMinor: payment.amount_minor,
      customerName: payment.customer_name || "Academic Candidate",
      customerEmail: payment.customer_email || "scholar@gradedge.com",
      paymentReference: providerReference,
      items,
      businessDetails,
    });

    // Upload privately to Supabase Storage 'invoices' bucket
    const storagePath = `${invoiceNumber}.pdf`;
    const { error: uploadErr } = await supabase.storage
      .from("invoices")
      .upload(storagePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (!uploadErr && invoice?.id) {
      pdfUrl = storagePath;
      await supabase.from("invoices").update({ pdf_url: storagePath }).eq("id", invoice.id);
    }
  } catch (pdfErr) {
    console.error("[PDF Invoice Generation Error]", pdfErr);
  }

  // 6. Activate whatever was paid for
  await activatePurchasedItem({ payment, supabase, invoiceNumber, pdfBuffer });

  // 7. Dispatch student in-app notification if user is registered
  if (payment.user_id) {
    await supabase.from("notifications").insert({
      user_id: payment.user_id,
      type: "payment_succeeded",
      title: "Payment Confirmed & Settled",
      body: `Your payment of ${formatMoney(payment.amount_minor, payment.currency)} was authorized. Official invoice ${invoiceNumber} is available in your billing records.`,
      link: "/student/billing",
    });
  }

  // 8. Log state change to audit_log
  await supabase.from("audit_log").insert({
    actor_id: payment.user_id || null,
    action: "payment_succeeded",
    entity: "payment",
    entity_id: payment.id,
    metadata: {
      reference: providerReference,
      amount_minor: payment.amount_minor,
      currency: payment.currency,
      purpose: payment.purpose,
      invoice_number: invoiceNumber,
    },
  });

  return { success: true, payment, invoiceNumber, pdfUrl, idempotent: false };
}

/**
 * Activates the paid service, booking, package, program, or membership
 */
async function activatePurchasedItem({
  payment,
  supabase,
  invoiceNumber,
  pdfBuffer,
}: {
  payment: any;
  supabase: any;
  invoiceNumber: string;
  pdfBuffer?: Buffer;
}) {
  const customerEmail = payment.customer_email;
  const customerName = payment.customer_name || "Academic Candidate";
  const amountFormatted = formatMoney(payment.amount_minor, payment.currency);

  // A. PAID SESSION BOOKING
  if (payment.purpose === "booking" && payment.related_id) {
    const bookingId = payment.related_id;
    const { data: booking } = await supabase.from("bookings").select("*").eq("id", bookingId).single();

    if (booking) {
      // Confirm booking
      await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          payment_id: payment.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId);

      // Auto-assign mentor if needed
      if (!booking.mentor_id) {
        const mentorId = await assignMentorForBooking({
          serviceId: booking.service_id,
          startsAt: booking.starts_at,
          endsAt: booking.ends_at,
        });
        if (mentorId) {
          await supabase.from("bookings").update({ mentor_id: mentorId }).eq("id", bookingId);
        }
      }

      // Generate .ics calendar invite
      const startsDate = new Date(booking.starts_at);
      const endsDate = new Date(booking.ends_at);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const manageUrl = `${siteUrl}/booking/manage/${booking.cancellation_token || booking.id}`;

      const ics = generateICSString({
        uid: `booking-${booking.id}@gradedge.com`,
        summary: `GradEdge Mentoring Session: ${booking.notes || "Thesis Coaching"}`,
        description: `Your 60-minute individual academic coaching session.\nMeeting Link: ${booking.meeting_url || "Sent prior to session"}\nManage booking: ${manageUrl}`,
        startsAt: startsDate,
        endsAt: endsDate,
        location: booking.meeting_url || undefined,
      });

      // Send confirmation email
      await sendBookingConfirmationEmail({
        to: customerEmail,
        name: customerName,
        dateStr: `${startsDate.toDateString()} at ${startsDate.toTimeString().slice(0, 5)} UTC`,
        timezone: "UTC",
        meetingUrl: booking.meeting_url || "Link dispatched 1 hour prior to session",
        manageUrl,
        icsContent: ics,
      });
    }
  }

  // B. PACKAGE -> Create or update Project
  else if (payment.purpose === "package") {
    const meta = payment.metadata || {};
    if (payment.user_id) {
      await supabase.from("projects").insert({
        student_id: payment.user_id,
        service_id: meta.service_id || "00000000-0000-0000-0000-000000000001",
        package_id: meta.package_id || null,
        title: meta.title || "Academic Mentoring Project",
        brief: meta.description || `Purchased package: ${meta.package_name || "Mentoring milestone"}`,
        status: "active",
      });
    }

    await sendPaymentReceiptEmail({
      to: customerEmail,
      customerName,
      invoiceNumber,
      amountFormatted,
      purposeDescription: `Package Scope: ${meta.title || meta.package_name || "Academic Mentoring Package"}`,
      paymentReference: payment.provider_reference,
      pdfBuffer,
    });
  }

  // C. ACCELERATOR PROGRAM
  else if (payment.purpose === "program") {
    const meta = payment.metadata || {};
    if (payment.related_id) {
      await supabase
        .from("program_applications")
        .update({ status: "accepted", updated_at: new Date().toISOString() })
        .eq("id", payment.related_id);
    }

    await sendPaymentReceiptEmail({
      to: customerEmail,
      customerName,
      invoiceNumber,
      amountFormatted,
      purposeDescription: meta.title || "12-Week Doctoral Research Accelerator Program",
      paymentReference: payment.provider_reference,
      pdfBuffer,
    });
  }

  // D. MEMBERSHIP
  else if (payment.purpose === "membership") {
    const meta = payment.metadata || {};
    if (payment.user_id) {
      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + 30); // 30-day billing cycle

      // Insert or update membership
      await supabase.from("memberships").upsert({
        user_id: payment.user_id,
        plan_id: meta.plan_id || "00000000-0000-0000-0001-000000000001",
        status: "active",
        current_period_end: periodEnd.toISOString(),
        paystack_subscription_code: meta.subscription_code || null,
        updated_at: new Date().toISOString(),
      });
    }

    await sendPaymentReceiptEmail({
      to: customerEmail,
      customerName,
      invoiceNumber,
      amountFormatted,
      purposeDescription: meta.title || "GradEdge Academic Research Membership",
      paymentReference: payment.provider_reference,
      pdfBuffer,
    });
  }
}

/**
 * Handles Payment Failure / Cancellation
 */
export async function processPaymentFailure({
  providerReference,
  reason,
  rawPayload,
}: {
  providerReference: string;
  reason?: string;
  rawPayload?: Record<string, unknown>;
}) {
  const supabase = createServiceRoleClient();

  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("provider_reference", providerReference)
    .single();

  if (!payment) return;

  await supabase
    .from("payments")
    .update({
      status: "failed",
      raw_payload: rawPayload || {},
      updated_at: new Date().toISOString(),
    })
    .eq("id", payment.id);

  // If this was a booking, leave slot open or cancel pending booking
  if (payment.purpose === "booking" && payment.related_id) {
    await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        cancellation_reason: "Payment authorization failed or was abandoned",
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.related_id);
  }

  await supabase.from("audit_log").insert({
    actor_id: payment.user_id || null,
    action: "payment_failed",
    entity: "payment",
    entity_id: payment.id,
    metadata: {
      reference: providerReference,
      reason: reason || "Declined by issuing bank",
    },
  });
}

/**
 * Handles Refund Execution by Admin
 */
export async function processPaymentRefund({
  paymentId,
  amountMinor,
  reason,
  adminId,
}: {
  paymentId: string;
  amountMinor?: number;
  reason: string;
  adminId: string;
}) {
  const supabase = createServiceRoleClient();

  const { data: payment, error: pErr } = await supabase
    .from("payments")
    .select("*, invoices(*)")
    .eq("id", paymentId)
    .single();

  if (pErr || !payment) {
    throw new Error(`Payment with id '${paymentId}' not found.`);
  }

  if (payment.status !== "succeeded") {
    throw new Error(`Cannot refund payment with status '${payment.status}'. Only succeeded payments can be refunded.`);
  }

  const refundMinor = amountMinor || payment.amount_minor;

  // Execute refund via provider
  const refundRes = await paymentProvider.refund({
    transactionReference: payment.provider_reference,
    amountMinor: refundMinor,
    reason,
  });

  if (!refundRes.success) {
    throw new Error("Payment provider declined refund request.");
  }

  // Update status
  await supabase
    .from("payments")
    .update({
      status: "refunded",
      updated_at: new Date().toISOString(),
    })
    .eq("id", payment.id);

  const invoiceNumber = payment.invoices?.[0]?.number || `GE-${new Date().getFullYear()}-0001`;

  // Dispatch refund email
  if (payment.customer_email) {
    await sendRefundConfirmationEmail({
      to: payment.customer_email,
      customerName: payment.customer_name || "Academic Candidate",
      invoiceNumber,
      amountFormatted: formatMoney(refundMinor, payment.currency),
      reason,
    });
  }

  // Audit log
  await supabase.from("audit_log").insert({
    actor_id: adminId,
    action: "payment_refunded",
    entity: "payment",
    entity_id: payment.id,
    metadata: {
      refund_amount_minor: refundMinor,
      reason,
      provider_refund_id: refundRes.refundId,
    },
  });

  return { success: true, refundId: refundRes.refundId, amountRefundedMinor: refundMinor };
}
