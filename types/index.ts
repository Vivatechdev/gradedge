export type UserRole = "student" | "mentor" | "admin";
export type StudyLevel = "undergraduate" | "masters" | "phd" | "researcher" | "other";
export type ProfileStatus = "active" | "suspended";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  institution: string;
  study_level: StudyLevel;
  field_of_study: string;
  timezone: string;
  phone?: string | null;
  marketing_opt_in: boolean;
  status: ProfileStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Mentor profile (Strictly private: never exposed publicly)
 */
export interface Mentor {
  profile_id: string;
  headline: string;
  bio: string;
  credentials: string;
  disciplines: string[];
  software: string[];
  photo_url?: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Limited mentor view visible only to assigned students
 */
export interface AssignedMentorView {
  profile_id: string;
  first_name: string;
  photo_url?: string | null;
  bio: string;
  disciplines: string[];
  software: string[];
}

export type DeliveryMode = "session" | "project" | "program" | "membership";

export interface Service {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  price_from_minor: number;
  currency: string;
  delivery_mode: DeliveryMode;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  service_id: string;
  name: string;
  description: string;
  price_minor: number;
  currency: string;
  includes: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = "requested" | "scoping" | "active" | "on_hold" | "completed" | "cancelled";

export interface Project {
  id: string;
  student_id: string;
  mentor_id?: string | null;
  service_id: string;
  package_id?: string | null;
  title: string;
  brief: string;
  status: ProjectStatus;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
}

export type MilestoneStatus = "pending" | "in_progress" | "done";

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  due_date?: string | null;
  status: MilestoneStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = "pending_payment" | "confirmed" | "completed" | "cancelled" | "no_show";

export interface Booking {
  id: string;
  student_id?: string | null;
  guest_name?: string | null;
  guest_email?: string | null;
  mentor_id: string;
  service_id: string;
  project_id?: string | null;
  starts_at: string;
  ends_at: string;
  status: BookingStatus;
  meeting_url?: string | null;
  notes?: string | null;
  payment_id?: string | null;
  cancellation_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = "initiated" | "succeeded" | "failed" | "refunded";
export type PaymentPurpose = "booking" | "package" | "program" | "membership";

export interface Payment {
  id: string;
  user_id?: string | null;
  provider: "paystack";
  provider_reference: string;
  amount_minor: number;
  currency: string;
  status: PaymentStatus;
  purpose: PaymentPurpose;
  related_id?: string | null;
  raw_payload: Record<string, unknown>;
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  payment_id: string;
  number: string;
  pdf_url?: string | null;
  issued_at: string;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

