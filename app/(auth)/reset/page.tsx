import { redirect } from "next/navigation";

export default function LegacyResetPage() {
  redirect("/reset-password");
}
