import BookConsultationPage, { metadata as bookMetadata } from "../book/page";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Book a Free 20-Minute Advisory Consultation — GradEdge",
  description:
    "Schedule a confidential 20-minute call with an academic advisor. We discuss your dissertation status, bottlenecks, and mentor availability.",
  path: "/booking",
});

export default BookConsultationPage;
