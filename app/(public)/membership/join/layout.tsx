import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Join — Choose a Membership Plan",
  description:
    "Select a GradEdge membership plan to get ongoing mentoring, written feedback and priority support.",
  path: "/membership/join",
});

export default function MembershipJoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

