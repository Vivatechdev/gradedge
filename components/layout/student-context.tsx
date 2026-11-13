"use client";

import React, { createContext, useContext } from "react";
import { ToastProvider } from "@/components/ui/toast";

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  institution: string;
  studyLevel: string;
  fieldOfStudy: string;
  timezone: string;
  avatarUrl?: string | null;
}

const StudentUserContext = createContext<StudentUser>({
  id: "",
  name: "Doctoral Candidate",
  email: "scholar@university.edu",
  institution: "Postgraduate Researcher",
  studyLevel: "Doctoral / PhD",
  fieldOfStudy: "Research Methodology",
  timezone: "UTC",
});

export function StudentProvider({
  user,
  children,
}: {
  user: StudentUser;
  children: React.ReactNode;
}) {
  return (
    <StudentUserContext.Provider value={user}>
      <ToastProvider>{children}</ToastProvider>
    </StudentUserContext.Provider>
  );
}

export function useStudent() {
  return useContext(StudentUserContext);
}

