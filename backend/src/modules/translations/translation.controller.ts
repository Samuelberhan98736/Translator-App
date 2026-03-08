import type { Request, Response } from "express";
import {
  cancelTranslationJob,
  createTranslationJob,
  getTranslationJob,
  translateNow
} from "./translation.service";
import { TranslateRequestSchema } from "./translation.types";

export function createTranslation(req: Request, res: Response): void {
  const parsed = TranslateRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const userId = req.user?.id ?? "anonymous";
  const job = createTranslationJob(parsed.data, userId);

  res.status(202).json({ jobId: job.id, status: job.status });
}

export function getTranslation(req: Request, res: Response): void {
  const jobId = String(req.params.jobId ?? "");
  const job = getTranslationJob(jobId);

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

export function cancelTranslation(req: Request, res: Response): void {
  const userId = req.user?.id ?? "anonymous";
  const jobId = String(req.params.jobId ?? "");
  const job = cancelTranslationJob(jobId, userId);

  if (!job) {
    res.status(404).json({ error: "Unable to cancel translation job" });
    return;
  }

  res.json({ jobId: job.id, status: job.status });
}

export function transformLegacy(req: Request, res: Response): void {
  const parsed = TranslateRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const result = translateNow(parsed.data);
  res.json(result);
}
