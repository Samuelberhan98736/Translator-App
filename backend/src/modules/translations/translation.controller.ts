import type { Request, Response } from "express";
import { translateWithAI } from "../../integrations/openai/openai.service";
import {
  cancelTranslationJob,
  createTranslationJob,
  getTranslationJob,
  getUserTranslations
} from "./translation.service";
import { TranslateRequestSchema } from "./translation.types";

export async function createTranslation(req: Request, res: Response): Promise<void> {
  const parsed = TranslateRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const userId = req.user?.id ?? "anonymous";

  try {
    const job = await createTranslationJob(parsed.data, userId);
    res.status(202).json({ jobId: job.id, status: job.status });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to create job" });
  }
}

export async function getTranslation(req: Request, res: Response): Promise<void> {
  const jobId = String(req.params.jobId ?? "");
  const job = await getTranslationJob(jobId);

  if (!job) {
    res.status(404).json({ error: "Translation job not found" });
    return;
  }

  if (req.user?.id && job.userId !== req.user.id && req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  res.json(job);
}

export async function cancelTranslation(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id ?? "anonymous";
  const jobId = String(req.params.jobId ?? "");
  const job = await cancelTranslationJob(jobId, userId);

  if (!job) {
    res.status(404).json({ error: "Unable to cancel translation job" });
    return;
  }

  res.json({ jobId: job.id, status: job.status });
}

export async function listTranslations(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const jobs = await getUserTranslations(userId);
  res.json(jobs);
}

export async function transformLegacy(req: Request, res: Response): Promise<void> {
  const parsed = TranslateRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const result = await translateWithAI(parsed.data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Translation failed" });
  }
}
