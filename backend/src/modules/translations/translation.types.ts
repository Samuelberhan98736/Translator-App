import { z } from "zod";
import {
  OpportunityTypeSchema,
  SchedulePreferenceSchema,
  StudentProfileSchema
} from "../profiles/profile.types";

export const TranslateRequestSchema = z.object({
  jobTitle: z.string().min(1),
  jobDescription: z.string().min(1),
  resumeText: z.string().min(1),
  handshakeUrl: z.string().url().optional(),
  source: z.enum(["manual", "handshake", "job-search"]).optional(),
  company: z.string().trim().optional(),
  opportunityType: OpportunityTypeSchema.optional(),
  schedulePreference: SchedulePreferenceSchema.optional(),
  profile: StudentProfileSchema.optional()
});

export type CreateTranslationRequest = z.infer<typeof TranslateRequestSchema>;

export interface CapabilityGap {
  capability: string;
  severity: "high" | "medium";
  evidence: string;
  recommendation: string;
}

export interface TranslationResult {
  transformedResume: string;
  capabilityGaps: CapabilityGap[];
  skillGaps: string[];
  matchedKeywords: string[];
  profileSummary: string;
}

export type TranslationJobStatus = "queued" | "running" | "completed" | "failed" | "canceled";

export interface TranslationJob {
  id: string;
  userId: string;
  status: TranslationJobStatus;
  input: CreateTranslationRequest;
  result: TranslationResult | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}
