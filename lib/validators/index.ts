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
  service_id: z.string().uuid("Invalid service selection"),
  starts_at: z.string().datetime("Invalid date/time format"),
  guest_name: z.string().min(2, "Please enter your name"),
  guest_email: z.string().email("Please enter a valid email address"),
  notes: z.string().max(1000).optional(),
});

export const NewsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  source: z.string().default("website"),
});

export const ProgramApplicationSchema = z.object({
  full_name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid academic email address"),
  institution: z.string().min(2, "Please enter your university or institution"),
  study_level: z.enum(["phd", "masters", "other"]),
  field_of_study: z.string().min(2, "Please enter your field of study"),
  dissertation_title: z.string().min(3, "Please enter your working title"),
  summary: z.string().min(10, "Please provide a research summary"),
  supervisor_feedback: z.string().optional(),
  timeline: z.string().min(2, "Please state your target timeline"),
  heard_from: z.string().optional(),
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
export const newsletterSchema = NewsletterSchema;
export const workshopRequestSchema = WorkshopRequestSchema;
export const programApplicationSchema = ProgramApplicationSchema;
export const blogPostSchema = BlogPostSchema;


