import { API_ROUTES } from "@/features/translate/constants";
import { apiGet, apiPost } from "@/lib/api";
import type { TranslateInput, TranslateResult } from "@/features/translate/types";

export interface TranslationHistoryItem {
  id: string;
  status: string;
  input: {
    jobTitle: string;
    company?: string;
    opportunityType?: string;
  };
  result: TranslateResult | null;
  createdAt: string;
}

export async function getTranslationHistory(): Promise<TranslationHistoryItem[]> {
  return apiGet<TranslationHistoryItem[]>(API_ROUTES.translationHistory);
}

export async function translateService(input: TranslateInput): Promise<TranslateResult> {
  const payload = {
    jobTitle: input.jobTitle,
    jobDescription: input.jobDescription,
    resumeText: input.resumeText,
    company: input.company || undefined,
    source: input.source || "manual",
    opportunityType: input.opportunityType || undefined,
    schedulePreference: input.schedulePreference || undefined,
    handshakeUrl: input.handshakeUrl || undefined,
    handshakeTitle: input.handshakeTitle || undefined,
    handshakeDescription: input.handshakeDescription || undefined,
    profile: input.profile || undefined
  };

  return apiPost<TranslateResult>(API_ROUTES.translate, payload);
}
