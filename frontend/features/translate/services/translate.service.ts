import { API_ROUTES } from "@/features/translate/constants";
import type { TranslateInput, TranslateResult } from "@/features/translate/types";
import { apiGet, apiPost } from "@/lib/api";

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

interface JobResponse {
  jobId: string;
  status: string;
}

interface JobStatusResponse {
  id: string;
  status: "queued" | "running" | "completed" | "failed" | "canceled";
  result: TranslateResult | null;
  error: string | null;
}

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 120_000; // 2 minutes

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Submit a translation job and poll until it completes.
 * Calls onStatusChange with "queued" / "running" during processing.
 */
export async function translateService(
  input: TranslateInput,
  onStatusChange?: (status: "queued" | "running") => void
): Promise<TranslateResult> {
  const payload = {
    jobTitle: input.jobTitle,
    jobDescription: input.jobDescription,
    resumeText: input.resumeText,
    company: input.company || undefined,
    source: input.source || "manual",
    opportunityType: input.opportunityType || undefined,
    schedulePreference: input.schedulePreference || undefined,
    handshakeUrl: input.handshakeUrl || undefined,
    profile: input.profile || undefined
  };

  // 1. Create the job
  const { jobId } = await apiPost<JobResponse>(API_ROUTES.translations, payload);

  onStatusChange?.("queued");

  // 2. Poll until completed or failed
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);

    const job = await apiGet<JobStatusResponse>(API_ROUTES.translationJob(jobId));

    if (job.status === "running") {
      onStatusChange?.("running");
    }

    if (job.status === "completed") {
      if (!job.result) throw new Error("Job completed but returned no result.");
      return job.result;
    }

    if (job.status === "failed") {
      throw new Error(job.error ?? "Translation failed.");
    }

    if (job.status === "canceled") {
      throw new Error("Translation was canceled.");
    }
  }

  throw new Error("Translation timed out. Please try again.");
}

export async function getTranslationHistory(): Promise<TranslationHistoryItem[]> {
  return apiGet<TranslationHistoryItem[]>(API_ROUTES.translationHistory);
}
