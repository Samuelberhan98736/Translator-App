import { z } from "zod";

export const TranslateRequestSchema = z.object({
  jobTitle: z.string().min(1),
  jobDescription: z.string().min(1),
  resumeText: z.string().min(1),
  handshakeUrl: z.string().url().optional()
});

export type CreateTranslationRequest = z.infer<typeof TranslateRequestSchema>;

export interface TranslationResult {
  transformedResume: string;
  skillGaps: string[];
  matchedKeywords: string[];
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
