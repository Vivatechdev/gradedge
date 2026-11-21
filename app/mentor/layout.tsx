import { requireRole } from "@/lib/auth/server";
import { ToastProvider } from "@/components/ui/toast";

export default async function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("mentor", "/mentor");
  return <ToastProvider>{children}</ToastProvider>;
}

