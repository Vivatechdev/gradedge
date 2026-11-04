import { z } from "zod";

export const LeadSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  institution: z.string().min(2, "Please enter your university or institution").optional(),
  study_level: z.enum(["undergraduate", "masters", "phd", "researcher", "other"]).optional(),
  interest: z.string().min(1, "Please select an area of interest").optional(),
  message: z.string().min(10, "Please describe your research support needs"),
  source: z.string().optional(),
});

export type LeadInput = z.infer<typeof LeadSchema>;

export const BookingSchema = z.object({
  service_id: z.string().uuid("Invalid service selection").optional(),
  starts_at: z.string().datetime("Invalid date/time format"),
  guest_name: z.string().min(2, "Please enter your name"),
  guest_email: z.string().email("Please enter a valid email address"),
  guest_study_level: z.enum(["undergraduate", "masters", "phd", "researcher", "other"]).optional(),
  guest_topic: z.string().optional(),
  timezone: z.string().default("UTC"),
  notes: z.string().max(1000).optional(),
});

export type BookingInput = z.infer<typeof BookingSchema>;

export const ConsultationBookingSchema = z.object({
  starts_at: z.string().datetime("Please select a valid time slot"),
  timezone: z.string().default("UTC"),
  full_name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  study_level: z.enum(["undergraduate", "masters", "phd", "researcher", "other"], {
    message: "Please select your study level",
  }),
  topic_help: z.string().min(3, "Please describe what you need help with"),
  message: z.string().max(1500).optional(),
});

export type ConsultationBookingInput = z.infer<typeof ConsultationBookingSchema>;

export const RescheduleBookingSchema = z.object({
  token: z.string().min(8, "Invalid reschedule token"),
  starts_at: z.string().datetime("Please select a valid time slot"),
  timezone: z.string().default("UTC"),
});

export type RescheduleBookingInput = z.infer<typeof RescheduleBookingSchema>;

export const CancelBookingSchema = z.object({
  token: z.string().min(8, "Invalid cancellation token"),
  reason: z.string().max(500).optional(),
});

export type CancelBookingInput = z.infer<typeof CancelBookingSchema>;

export const PaidSessionBookingSchema = z.object({
  service_id: z.string().min(1, "Please select a service"),
  starts_at: z.string().datetime("Please select a valid time slot"),
  timezone: z.string().default("UTC"),
  notes: z.string().max(1000).optional(),
});

export type PaidSessionBookingInput = z.infer<typeof PaidSessionBookingSchema>;

export const SupportRequestSchema = z.object({
  service_id: z.string().min(1, "Please select a service"),
  title: z.string().min(3, "Please enter a descriptive title for your request"),
  brief: z.string().min(10, "Please describe the specific assistance or review you require"),
  deadline: z.string().optional(),
  files: z
    .array(
      z.object({
        file_name: z.string(),
        bucket_path: z.string(),
        size_bytes: z.number(),
        mime_type: z.string(),
      })
    )
    .optional(),
});

export type SupportRequestInput = z.infer<typeof SupportRequestSchema>;

export const NewsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  source: z.string().default("website"),
});

export const ProgramApplicationSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid academic email address"),
  institution: z.string().min(2, "Please enter your university or institution"),
  doctoral_stage: z.string().min(2, "Please specify your doctoral stage"),
  topic_summary: z.string().min(10, "Please provide a summary of your research topic"),
  completed_summary: z.string().min(10, "Please outline what you have completed so far"),
  desired_outcomes: z.string().min(10, "Please describe what you want from the accelerator program"),
  preferred_start: z.string().min(2, "Please choose your preferred start timeframe"),
  // Backward compatibility fields
  full_name: z.string().optional(),
  study_level: z.string().optional(),
  field_of_study: z.string().optional(),
  dissertation_title: z.string().optional(),
  summary: z.string().optional(),
  timeline: z.string().optional(),
});

export type ProgramApplicationInput = z.infer<typeof ProgramApplicationSchema>;

export const WorkshopRequestSchema = z.object({
  institution_name: z.string().min(2, "Please enter your institution name"),
  contact_name: z.string().min(2, "Please enter your contact name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  topic: z.string().min(2, "Please select a workshop topic"),
  attendee_count: z.number().int().positive("Attendee count must be positive"),
  preferred_date: z.string().optional(),
  notes: z.string().optional(),
});

export type WorkshopRequestInput = z.infer<typeof WorkshopRequestSchema>;

export const BlogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug is required"),
  standfirst: z.string().min(10, "Standfirst must be at least 10 characters"),
  body_markdown: z.string().min(50, "Body content is required"),
  category_id: z.string().uuid("Invalid category").optional(),
  featured_image: z.string().min(1, "Featured image URL or path is required"),
  featured_image_alt: z.string().min(5, "Descriptive alt text is required for accessibility"),
  reading_time_minutes: z.number().int().positive(),
  status: z.enum(["draft", "published", "archived"]),
});

export type BlogPostInput = z.infer<typeof BlogPostSchema>;

export const RegisterSchema = z
  .object({
    full_name: z.string().min(2, "Please enter your full name"),
    email: z.string().email("Please enter a valid institutional or personal email address"),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters long"),
    confirm_password: z.string().min(1, "Please confirm your password"),
    study_level: z.enum(["undergraduate", "masters", "phd", "researcher", "other"], {
      message: "Please select your current study level",
    }),
    institution: z.string().min(2, "Please enter your university or institution"),
    field_of_study: z.string().min(2, "Please enter your discipline or field of study"),
    timezone: z.string().default("UTC"),
    terms_accepted: z.literal(true, {
      message: "You must accept the Terms and Academic Integrity Policy to create an account.",
    }),
    terms_version: z.string().default("1.0"),
    marketing_opt_in: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const CompleteProfileSchema = z.object({
  study_level: z.enum(["undergraduate", "masters", "phd", "researcher", "other"], {
    message: "Please select your current study level",
  }),
  institution: z.string().min(2, "Please enter your university or institution"),
  field_of_study: z.string().min(2, "Please enter your discipline or field of study"),
  timezone: z.string().default("UTC"),
  terms_accepted: z.literal(true, {
    message: "You must accept the Terms and Academic Integrity Policy to continue.",
  }),
  terms_version: z.string().default("1.0"),
  marketing_opt_in: z.boolean().default(false),
});

export type CompleteProfileInput = z.infer<typeof CompleteProfileSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResendVerificationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ResendVerificationInput = z.infer<typeof ResendVerificationSchema>;

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(10, "Password must be at least 10 characters long"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const leadSchema = LeadSchema;
export const bookingSchema = BookingSchema;
export const consultationBookingSchema = ConsultationBookingSchema;
export const rescheduleBookingSchema = RescheduleBookingSchema;
export const cancelBookingSchema = CancelBookingSchema;
export const paidSessionBookingSchema = PaidSessionBookingSchema;
export const supportRequestSchema = SupportRequestSchema;
export const newsletterSchema = NewsletterSchema;
export const workshopRequestSchema = WorkshopRequestSchema;
export const programApplicationSchema = ProgramApplicationSchema;
export const blogPostSchema = BlogPostSchema;


