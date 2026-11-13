import { requireUser } from "@/lib/auth/server";
import { StudentProvider } from "@/components/layout/student-context";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await requireUser("/student");

  const studentUser = {
    id: user.id,
    name: profile?.full_name || user.user_metadata?.full_name || "Doctoral Candidate",
    email: user.email || "",
    institution: profile?.institution || "Doctoral Researcher",
    studyLevel: profile?.study_level || "Doctoral / PhD",
    fieldOfStudy: profile?.field_of_study || "Research Methodology",
    timezone: profile?.timezone || "UTC",
    avatarUrl: profile?.avatar_url || null,
  };

  return <StudentProvider user={studentUser}>{children}</StudentProvider>;
}
