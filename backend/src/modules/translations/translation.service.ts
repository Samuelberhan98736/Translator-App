import { supabaseAdmin } from "../../db/client";
import { translateWithAI } from "../../integrations/openai/openai.service";
import { enqueue } from "../../queue/queue";
import type {
  CreateTranslationRequest,
  TranslationJob,
  TranslationResult
} from "./translation.types";

// Holds resume text in memory between job creation and processing.
// The resume text is not stored in the DB — it lives only for the duration
// of the job lifecycle on this server instance.
const pendingResumes = new Map<string, string>();

// ─── DB → domain mapper ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToJob(row: any, output?: any): TranslationJob {
  const result: TranslationResult | null = output
    ? {
        transformedResume: output.transformed_resume,
        capabilityGaps: output.capability_gaps ?? [],
        skillGaps: output.skill_gaps ?? [],
        matchedKeywords: output.matched_keywords ?? [],
        profileSummary: output.profile_summary ?? ""
      }
    : null;

  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    input: {
      jobTitle: row.job_title,
      jobDescription: row.job_description,
      resumeText: "",          // not persisted — populated transiently during processing
      company: row.company ?? undefined,
      source: row.source,
      opportunityType: row.opportunity_type ?? undefined,
      schedulePreference: row.schedule_preference ?? undefined,
      handshakeUrl: row.handshake_url ?? undefined,
      profile: row.profile_snapshot ?? undefined
    },
    result,
    error: null,
    createdAt: row.created_at,
    updatedAt: row.finished_at ?? row.started_at ?? row.created_at
  };
}

// ─── Public service functions ─────────────────────────────────────────────────

export async function createTranslationJob(
  input: CreateTranslationRequest,
  userId: string
): Promise<TranslationJob> {
  const { data, error } = await supabaseAdmin
    .from("translation_jobs")
    .insert({
      user_id: userId,
      status: "queued",
      job_title: input.jobTitle,
      job_description: input.jobDescription,
      company: input.company ?? null,
      source: input.source ?? "manual",
      opportunity_type: input.opportunityType ?? null,
      schedule_preference: input.schedulePreference ?? null,
      handshake_url: input.handshakeUrl ?? null,
      profile_snapshot: input.profile ?? {}
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create translation job");
  }

  // Stash the resume text for the worker to pick up
  pendingResumes.set(data.id, input.resumeText);
  enqueue("translation", { jobId: data.id });

  return rowToJob(data);
}

export async function getTranslationJob(jobId: string): Promise<TranslationJob | null> {
  const { data: jobRow, error } = await supabaseAdmin
    .from("translation_jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error || !jobRow) return null;

  const { data: outputRow } = await supabaseAdmin
    .from("translation_outputs")
    .select("*")
    .eq("job_id", jobId)
    .maybeSingle();

  return rowToJob(jobRow, outputRow);
}

export async function getUserTranslations(userId: string): Promise<TranslationJob[]> {
  const { data: jobs, error } = await supabaseAdmin
    .from("translation_jobs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !jobs) return [];

  const jobIds = jobs.map((j) => j.id);
  const { data: outputs } = await supabaseAdmin
    .from("translation_outputs")
    .select("*")
    .in("job_id", jobIds);

  const outputMap = new Map((outputs ?? []).map((o) => [o.job_id, o]));

  return jobs.map((j) => rowToJob(j, outputMap.get(j.id)));
}

export async function cancelTranslationJob(
  jobId: string,
  userId: string
): Promise<TranslationJob | null> {
  const { data, error } = await supabaseAdmin
    .from("translation_jobs")
    .update({ status: "canceled" })
    .eq("id", jobId)
    .eq("user_id", userId)
    .in("status", ["queued", "running"])
    .select("*")
    .single();

  if (error || !data) return null;

  pendingResumes.delete(jobId);
  return rowToJob(data);
}

export async function processTranslationJob(jobId: string): Promise<void> {
  // Atomically claim the job — only processes if still queued
  const { data: jobRow, error } = await supabaseAdmin
    .from("translation_jobs")
    .update({ status: "running", started_at: new Date().toISOString() })
    .eq("id", jobId)
    .eq("status", "queued")
    .select("*")
    .single();

  if (error || !jobRow) return;

  const resumeText = pendingResumes.get(jobId) ?? "";
  pendingResumes.delete(jobId);

  const input: CreateTranslationRequest = {
    jobTitle: jobRow.job_title,
    jobDescription: jobRow.job_description,
    resumeText,
    company: jobRow.company ?? undefined,
    source: jobRow.source,
    opportunityType: jobRow.opportunity_type ?? undefined,
    schedulePreference: jobRow.schedule_preference ?? undefined,
    handshakeUrl: jobRow.handshake_url ?? undefined,
    profile: jobRow.profile_snapshot ?? undefined
  };

  try {
    const result = await translateWithAI(input);

    await supabaseAdmin.from("translation_outputs").insert({
      job_id: jobId,
      transformed_resume: result.transformedResume,
      capability_gaps: result.capabilityGaps,
      skill_gaps: result.skillGaps,
      matched_keywords: result.matchedKeywords,
      profile_summary: result.profileSummary
    });

    await supabaseAdmin
      .from("translation_jobs")
      .update({ status: "completed", finished_at: new Date().toISOString() })
      .eq("id", jobId);
  } catch {
    await supabaseAdmin
      .from("translation_jobs")
      .update({ status: "failed", finished_at: new Date().toISOString() })
      .eq("id", jobId);
  }
}
