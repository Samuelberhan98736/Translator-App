import { enqueue } from "../../queue/queue";
import type {
  CreateTranslationRequest,
  TranslationJob,
  TranslationResult
} from "./translation.types";

const translationJobs = new Map<string, TranslationJob>();

function extractKeywords(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((token) => token.length > 4)
    )
  ).slice(0, 12);
}

function computeSkillGaps(jobDescription: string, resumeText: string): string[] {
  const jdTokens = extractKeywords(jobDescription);
  const resumeTokens = new Set(extractKeywords(resumeText));
  return jdTokens.filter((token) => !resumeTokens.has(token)).slice(0, 8);
}

export function translateNow(input: CreateTranslationRequest): TranslationResult {
  const matchedKeywords = extractKeywords(input.jobDescription).filter((token) =>
    input.resumeText.toLowerCase().includes(token)
  );

  const transformedResume = [
    `Target Role: ${input.jobTitle}`,
    "",
    "Reframed Resume Summary:",
    `${input.resumeText}\n\nAligned toward role expectations from the supplied description.`
  ].join("\n");

  return {
    transformedResume,
    matchedKeywords,
    skillGaps: computeSkillGaps(input.jobDescription, input.resumeText)
  };
}

export function createTranslationJob(input: CreateTranslationRequest, userId: string): TranslationJob {
  const now = new Date().toISOString();
  const job: TranslationJob = {
    id: crypto.randomUUID(),
    userId,
    status: "queued",
    input,
    result: null,
    error: null,
    createdAt: now,
    updatedAt: now
  };

  translationJobs.set(job.id, job);
  enqueue("translation", { jobId: job.id });
  return job;
}

export function getTranslationJob(jobId: string): TranslationJob | null {
  return translationJobs.get(jobId) ?? null;
}

export function cancelTranslationJob(jobId: string, userId: string): TranslationJob | null {
  const job = translationJobs.get(jobId);
  if (!job || job.userId !== userId || job.status === "completed") {
    return null;
  }

  job.status = "canceled";
  job.updatedAt = new Date().toISOString();
  translationJobs.set(job.id, job);
  return job;
}

export async function processTranslationJob(jobId: string): Promise<void> {
  const job = translationJobs.get(jobId);

  if (!job || job.status !== "queued") {
    return;
  }

  job.status = "running";
  job.updatedAt = new Date().toISOString();

  try {
    const result = translateNow(job.input);
    job.result = result;
    job.status = "completed";
    job.updatedAt = new Date().toISOString();
  } catch (error) {
    job.status = "failed";
    job.error = error instanceof Error ? error.message : "Translation processing failed";
    job.updatedAt = new Date().toISOString();
  }
}
