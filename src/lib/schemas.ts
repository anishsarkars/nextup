
import { z } from "zod";

// Profile setup schema
export const profileSchema = z.object({
  linkedin_url: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .refine(
      (url) => url.includes("linkedin.com"),
      "This doesn't look like a LinkedIn URL"
    ),
  github_url: z
    .string()
    .url("Please enter a valid GitHub URL")
    .refine(
      (url) => url.includes("github.com"),
      "This doesn't look like a GitHub URL"
    ),
  portfolio_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  availability: z.enum(["open_to_collab", "busy"]).default("busy"),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Signup schema
export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms of service and privacy policy",
  }),
});

// Project creation schema
export const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  roles_needed: z.array(z.string()).min(1, "Select at least one role"),
  skill_tags: z.array(z.string()).min(1, "Select at least one skill tag"),
  deadline: z.string().optional(),
  external_links: z.array(
    z.object({
      label: z.string(),
      url: z.string().url("Please enter a valid URL"),
    })
  ).optional(),
});

// Gig creation schema
export const gigSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  gig_type: z.enum(["offering", "seeking"]),
  rate: z.string().min(1, "Rate is required"),
  duration: z.string().min(1, "Duration is required"),
  availability: z.string().min(1, "Availability is required"),
  tags: z.array(z.string()).min(1, "Select at least one tag"),
  deadline: z.string().optional(),
});
