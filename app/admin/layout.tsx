import { requireRole } from "@/lib/auth/server";
import { ToastProvider } from "@/components/ui/toast";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin", "/admin");
  return <ToastProvider>{children}</ToastProvider>;
}
