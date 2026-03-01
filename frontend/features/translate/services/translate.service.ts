import { API_ROUTES } from "@/features/translate/constants";
import { apiPost } from "@/lib/api";
import type { TranslateInput, TranslateResult } from "@/features/translate/types";

export async function translateService(input: TranslateInput): Promise<TranslateResult> {
  const payload = {
    jobTitle: input.jobTitle,
    jobDescription: input.jobDescription,
    resumeText: input.resumeText,
    handshakeUrl: input.handshakeUrl || undefined
  };

  return apiPost<TranslateResult>(API_ROUTES.translate, payload);
}
