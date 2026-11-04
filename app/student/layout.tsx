import { requireUser } from "@/lib/auth/server";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser("/student");
  return <>{children}</>;
}
