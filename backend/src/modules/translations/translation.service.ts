import { enqueue } from "../../queue/queue";
import type {
  CapabilityGap,
  CreateTranslationRequest,
  TranslationJob,
  TranslationResult
} from "./translation.types";

const translationJobs = new Map<string, TranslationJob>();

const STOP_WORDS = new Set([
  "about", "above", "after", "again", "against", "also", "always", "between",
  "their", "there", "these", "those", "through", "under", "until", "using",
  "where", "which", "while", "within", "would", "years", "could", "should",
  "other", "often", "every", "will", "with", "that", "this", "have", "from",
  "they", "been", "more", "your", "some", "when", "than", "then", "into",
  "able", "across", "based", "being", "both", "each", "each", "even", "given",
  "including", "multiple", "needs", "process", "strong", "tasks", "toward",
  "various", "well", "work", "working"
]);

// Skill-focused terms to prioritize in keyword extraction
const TECH_PATTERN = /^(typescript|javascript|python|react|node|sql|java|c\+\+|golang|rust|swift|kotlin|docker|kubernetes|aws|gcp|azure|mongodb|postgres|redis|graphql|rest|api|git|agile|scrum|machine|learning|data|analytics|testing|devops|linux|security|cloud|microservices|ci\/cd|html|css|next|express|django|spring)$/i;

function sanitizeText(text: string): string {
  // Strip HTML tags and control characters, normalize whitespace
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 50_000);
}

function extractKeywords(text: string): string[] {
  const tokens = sanitizeText(text)
    .toLowerCase()
    .replace(/[^a-z0-9+#\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 3 && !STOP_WORDS.has(token));

  // Prioritize tech/skill terms
  const techTerms = tokens.filter((t) => TECH_PATTERN.test(t));
  const otherTerms = tokens.filter((t) => !TECH_PATTERN.test(t));

  return Array.from(new Set([...techTerms, ...otherTerms])).slice(0, 15);
}

function computeSkillGaps(jobDescription: string, resumeText: string): string[] {
  const jdTokens = extractKeywords(jobDescription);
  const resumeTokens = new Set(extractKeywords(resumeText));
  return jdTokens.filter((token) => !resumeTokens.has(token)).slice(0, 8);
}

function buildProfileSummary(input: CreateTranslationRequest): string {
  if (!input.profile) {
    return "No structured student profile supplied.";
  }

  const parts = [
    input.profile.major ? `Major: ${input.profile.major}` : null,
    input.profile.role ? `Target Role: ${input.profile.role}` : null,
    `Track: ${input.profile.opportunityType}`,
    `Availability: ${input.profile.schedulePreference}`,
    input.profile.handshakeConnected ? "Handshake profile linked" : "Handshake profile not linked"
  ].filter(Boolean);

  return parts.join(" | ");
}

function buildCapabilityGaps(input: CreateTranslationRequest): CapabilityGap[] {
  const missingCapabilities = computeSkillGaps(sanitizeText(input.jobDescription), sanitizeText(input.resumeText));

  return missingCapabilities.slice(0, 5).map((capability, index) => ({
    capability,
    severity: index < 2 ? "high" : "medium",
    evidence: `The target description emphasizes "${capability}", but the submitted resume does not surface that language clearly.`,
    recommendation: `Add a bullet or project outcome that demonstrates ${capability} using measurable impact and the job-description phrasing.`
  }));
}

export function translateNow(input: CreateTranslationRequest): TranslationResult {
  const cleanJob = sanitizeText(input.jobDescription);
  const cleanResume = sanitizeText(input.resumeText);

  const matchedKeywords = extractKeywords(cleanJob).filter((token) =>
    cleanResume.toLowerCase().includes(token)
  );
  const skillGaps = computeSkillGaps(cleanJob, cleanResume);

  const profileSummary = buildProfileSummary(input);
  const opportunityLabel = input.opportunityType ?? input.profile?.opportunityType ?? "job";
  const scheduleLabel = input.schedulePreference ?? input.profile?.schedulePreference ?? "full-time";
  const targetRole = input.profile?.role || input.jobTitle;
  const targetCompany = input.company ? ` at ${input.company}` : "";
  const keywordHighlights = matchedKeywords.length
    ? matchedKeywords.map((keyword) => `- Demonstrates ${keyword} through project, coursework, or work outcomes.`).join("\n")
    : "- Add measurable examples that mirror the strongest verbs and tools in the target description.";

  const transformedResume = [
    `Target Role: ${targetRole}${targetCompany}`,
    `Target Format: ${opportunityLabel} | ${scheduleLabel}`,
    `Profile Context: ${profileSummary}`,
    "",
    "Reframed Resume Summary:",
    `Candidate is positioning for ${input.jobTitle}${targetCompany} by aligning prior experience with the language, tools, and delivery expectations stated in the target description.`,
    "",
    "Aligned Experience Themes:",
    keywordHighlights,
    "",
    "Working Resume Draft:",
    `${cleanResume}\n\nRewritten to emphasize business impact, role alignment, and standard job-description language.`
  ].join("\n");

  return {
    transformedResume,
    matchedKeywords,
    capabilityGaps: buildCapabilityGaps(input),
    skillGaps,
    profileSummary
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

export function getUserTranslations(userId: string): TranslationJob[] {
  return Array.from(translationJobs.values())
    .filter((job) => job.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
