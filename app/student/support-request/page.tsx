import { redirect } from "next/navigation";

export default function SupportRequestRedirect() {
  redirect("/student/requests/new");
}
