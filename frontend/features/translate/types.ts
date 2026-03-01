export type TranslateStatus = "idle" | "loading" | "success" | "error";

export interface TranslateInput {
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
  handshakeUrl?: string;
  handshakeTitle?: string;
  handshakeDescription?: string;
}

export interface TranslateResult {
  transformedResume: string;
  skillGaps: string[];
  matchedKeywords: string[];
}

export interface TranslateState {
  status: TranslateStatus;
  result: TranslateResult | null;
  error: string | null;
}
