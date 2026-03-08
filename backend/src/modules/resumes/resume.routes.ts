import { Router } from "express";
import { z } from "zod";

const ResumeSchema = z.object({
  resumeText: z.string().min(1),
  title: z.string().min(1).default("Untitled Resume")
});

type ResumeRecord = {
  id: string;
  userId: string;
  version: number;
  title: string;
  resumeText: string;
  createdAt: string;
};

const resumes = new Map<string, ResumeRecord[]>();

export const resumeRouter = Router();

resumeRouter.post("/", (req, res) => {
  const parsed = ResumeSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const userId = req.user?.id ?? "anonymous";
  const list = resumes.get(userId) ?? [];
  const nextVersion = list.length + 1;

  const record: ResumeRecord = {
    id: crypto.randomUUID(),
    userId,
    version: nextVersion,
    title: parsed.data.title,
    resumeText: parsed.data.resumeText,
    createdAt: new Date().toISOString()
  };

  list.push(record);
  resumes.set(userId, list);

  res.status(201).json(record);
});

resumeRouter.get("/:resumeId/versions", (req, res) => {
  const userId = req.user?.id ?? "anonymous";
  const list = resumes.get(userId) ?? [];
  const filtered = list.filter((item) => item.id === req.params.resumeId);
  res.json(filtered);
});

resumeRouter.delete("/:resumeId", (req, res) => {
  const userId = req.user?.id ?? "anonymous";
  const list = resumes.get(userId) ?? [];
  const next = list.filter((item) => item.id !== req.params.resumeId);
  resumes.set(userId, next);
  res.status(204).send();
});
