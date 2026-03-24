import type { StudentProfile } from "@/features/profile/types";

export type TranslateStatus = "idle" | "loading" | "success" | "error";

export interface TranslateInput {
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  company?: string;
  source?: "manual" | "handshake" | "job-search";
  opportunityType?: "job" | "internship";
  schedulePreference?: "part-time" | "full-time";
  handshakeUrl?: string;
  handshakeTitle?: string;
  handshakeDescription?: string;
  profile?: StudentProfile;
}

export interface CapabilityGap {
  capability: string;
  severity: "high" | "medium";
  evidence: string;
  recommendation: string;
}

export interface TranslateResult {
  transformedResume: string;
  capabilityGaps: CapabilityGap[];
  skillGaps: string[];
  matchedKeywords: string[];
  profileSummary: string;
}

export interface TranslateState {
  status: TranslateStatus;
  result: TranslateResult | null;
  error: string | null;
}
