import { formatMoney, Currency } from "./types";

export interface InvoiceItem {
  description: string;
  quantity: number;
  amountMinor: number;
}

export interface BusinessDetails {
  legalName?: string;
  address?: string;
  taxId?: string;
  financeEmail?: string;
  phone?: string;
  refundPolicyUrl?: string;
}

export interface InvoicePdfParams {
  invoiceNumber: string;
  issuedAt: Date | string;
  currency: Currency;
  amountMinor: number;
  customerName: string;
  customerEmail: string;
  paymentReference: string;
  items: InvoiceItem[];
  businessDetails?: BusinessDetails;
}

function escapePdfText(str: string): string {
  if (!str) return "";
  return str
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

/**
 * Builds a clean, standard PDF 1.4 buffer matching GradEdge brand specifications:
 * Deep Navy (#14263F), Gold (#C8963E), and Paper tones.
 */
export function generateInvoicePdfBuffer(params: InvoicePdfParams): Buffer {
  const business = {
    legalName: params.businessDetails?.legalName || "GradEdge Academic Solutions Ltd",
    address: params.businessDetails?.address || "Level 4, Academic Innovation Hub, Lagos & Oxford Desk",
    taxId: params.businessDetails?.taxId || "TIN-GE-2026-9481",
    financeEmail: params.businessDetails?.financeEmail || "finance@gradedge.com",
    phone: params.businessDetails?.phone || "+234 1 800 GRADEDGE",
    refundPolicyUrl: params.businessDetails?.refundPolicyUrl || "https://gradedge.com/legal/terms#refunds",
  };

  const issuedDateStr =
    typeof params.issuedAt === "string"
      ? new Date(params.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : params.issuedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const totalFormatted = formatMoney(params.amountMinor, params.currency);

  const lines: string[] = [];

  // 1. Navy Top Header Banner (RGB 0.078, 0.149, 0.247)
  lines.push("0.078 0.149 0.247 rg 0 760 595.28 81.89 re f");

  // 2. Gold Accent Rule (RGB 0.784, 0.588, 0.243)
  lines.push("0.784 0.588 0.243 rg 0 756 595.28 4 re f");

  // 3. Header Text
  lines.push("BT /F1 18 Tf 1 1 1 rg 40 795 Td (GRADEDGE) Tj ET");
  lines.push("BT /F2 9 Tf 1 1 1 rg 40 780 Td (Academic Research Mentoring & Defense Preparation) Tj ET");
  lines.push("BT /F1 13 Tf 1 1 1 rg 400 795 Td (OFFICIAL INVOICE) Tj ET");
  lines.push(`BT /F2 9 Tf 1 1 1 rg 400 780 Td (${escapePdfText(params.invoiceNumber)}) Tj ET`);

  // 4. Issue Date & Paid Status Badge
  lines.push(`BT /F2 9 Tf 0.294 0.333 0.388 rg 40 725 Td (Issued: ${escapePdfText(issuedDateStr)}) Tj ET`);
  lines.push("BT /F1 10 Tf 0.078 0.149 0.247 rg 400 725 Td (STATUS: PAID IN FULL) Tj ET");

  // Divider line
  lines.push("0.894 0.875 0.835 RG 1 w 40 710 m 555 710 l S");

  // 5. Issued By & Billed To Blocks
  lines.push("BT /F1 9 Tf 0.078 0.149 0.247 rg 40 688 Td (ISSUED BY:) Tj ET");
  lines.push(`BT /F2 9 Tf 0.294 0.333 0.388 rg 40 673 Td (${escapePdfText(business.legalName)}) Tj ET`);
  lines.push(`BT /F2 8.5 Tf 0.294 0.333 0.388 rg 40 659 Td (${escapePdfText(business.address)}) Tj ET`);
  lines.push(`BT /F2 8.5 Tf 0.294 0.333 0.388 rg 40 645 Td (Tax ID / Reg: ${escapePdfText(business.taxId)}) Tj ET`);

  lines.push("BT /F1 9 Tf 0.078 0.149 0.247 rg 340 688 Td (BILLED TO:) Tj ET");
  lines.push(`BT /F2 9 Tf 0.294 0.333 0.388 rg 340 673 Td (${escapePdfText(params.customerName)}) Tj ET`);
  lines.push(`BT /F2 8.5 Tf 0.294 0.333 0.388 rg 340 659 Td (${escapePdfText(params.customerEmail)}) Tj ET`);
  lines.push(`BT /F2 8.5 Tf 0.294 0.333 0.388 rg 340 645 Td (Reference: ${escapePdfText(params.paymentReference)}) Tj ET`);

  // 6. Items Table Header
  lines.push("0.078 0.149 0.247 rg 40 600 515 22 re f");
  lines.push("BT /F1 8.5 Tf 1 1 1 rg 50 607 Td (DELIVERABLE / MILESTONE DESCRIPTION) Tj ET");
  lines.push("BT /F1 8.5 Tf 1 1 1 rg 390 607 Td (QTY) Tj ET");
  lines.push("BT /F1 8.5 Tf 1 1 1 rg 460 607 Td (AMOUNT) Tj ET");

  // 7. Table Rows
  let y = 575;
  const items = params.items.length > 0 ? params.items : [
    { description: "Academic Mentoring Scope", quantity: 1, amountMinor: params.amountMinor }
  ];

  for (const item of items) {
    lines.push(`0.894 0.875 0.835 RG 0.5 w 40 ${y - 6} m 555 ${y - 6} l S`);
    lines.push(`BT /F1 8.5 Tf 0.078 0.149 0.247 rg 50 ${y} Td (${escapePdfText(item.description)}) Tj ET`);
    lines.push(`BT /F2 8.5 Tf 0.294 0.333 0.388 rg 395 ${y} Td (${item.quantity}) Tj ET`);
    lines.push(`BT /F1 8.5 Tf 0.078 0.149 0.247 rg 460 ${y} Td (${escapePdfText(formatMoney(item.amountMinor, params.currency))}) Tj ET`);
    y -= 28;
  }

  // 8. Total Summary Card
  lines.push(`0.98 0.973 0.957 rg 340 ${y - 36} 215 32 re f`);
  lines.push(`0.784 0.588 0.243 RG 1.5 w 340 ${y - 36} 215 32 re S`);
  lines.push(`BT /F1 11 Tf 0.078 0.149 0.247 rg 355 ${y - 22} Td (TOTAL PAID: ${escapePdfText(totalFormatted)}) Tj ET`);

  // 9. Payment Guarantee Note
  lines.push(`BT /F2 8.5 Tf 0.294 0.333 0.388 rg 40 ${y - 80} Td (Payment Method: Authorized electronic card/bank payment via Paystack) Tj ET`);
  lines.push(`BT /F2 8.5 Tf 0.294 0.333 0.388 rg 40 ${y - 95} Td (Payment Status: Settled. Intellectual property and research authorship remain 100% with the candidate.) Tj ET`);

  // 10. Footer Section
  lines.push("0.894 0.875 0.835 RG 1 w 40 75 m 555 75 l S");
  lines.push(`BT /F2 7.5 Tf 0.294 0.333 0.388 rg 40 60 Td (${escapePdfText(business.legalName)} | All mentoring adheres to university integrity guidelines.) Tj ET`);
  lines.push(`BT /F2 7.5 Tf 0.294 0.333 0.388 rg 40 48 Td (Refund Policy: ${escapePdfText(business.refundPolicyUrl)} | Finance: ${escapePdfText(business.financeEmail)}) Tj ET`);

  const streamContent = lines.join("\n");
  const streamLength = Buffer.byteLength(streamContent);

  let out = "%PDF-1.4\n";
  const offsets: number[] = [];

  function addObj(str: string) {
    offsets.push(Buffer.byteLength(out));
    out += str + "\n";
  }

  addObj("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
  addObj("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj");
  addObj(
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj"
  );
  addObj(`4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj`);
  addObj("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj");
  addObj("6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj");

  const xrefOffset = Buffer.byteLength(out);
  out += `xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    out += `${off.toString().padStart(10, "0")} 00000 n \n`;
  }
  out += `trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(out, "utf-8");
}

