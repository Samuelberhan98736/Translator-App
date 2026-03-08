import { API_ROUTES } from "@/features/translate/constants";
import { apiGet } from "@/lib/api";
import type { TranslateResult } from "@/features/translate/types";

export type TranslationJobStatus = "queued" | "running" | "completed" | "failed" | "canceled";

export interface TranslationJobResponse {
  id: string;
  status: TranslationJobStatus;
  result: TranslateResult | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getTranslationStatus(jobId: string): Promise<TranslationJobResponse> {
  return apiGet<TranslationJobResponse>(`${API_ROUTES.translations}/${jobId}`);
}
