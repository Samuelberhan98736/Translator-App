import { Router } from "express";
import { z } from "zod";

const JobTargetSchema = z.object({
  jobTitle: z.string().min(1),
  jobDescription: z.string().min(1)
});

type JobTarget = {
  id: string;
  userId: string;
  jobTitle: string;
  jobDescription: string;
  createdAt: string;
};

const jobTargets = new Map<string, JobTarget>();

export const jobTargetRouter = Router();

jobTargetRouter.post("/", (req, res) => {
  const parsed = JobTargetSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const target: JobTarget = {
    id: crypto.randomUUID(),
    userId: req.user?.id ?? "anonymous",
    jobTitle: parsed.data.jobTitle,
    jobDescription: parsed.data.jobDescription,
    createdAt: new Date().toISOString()
  };

  jobTargets.set(target.id, target);
  res.status(201).json(target);
});

jobTargetRouter.get("/:id", (req, res) => {
  const target = jobTargets.get(req.params.id);

  if (!target) {
    res.status(404).json({ error: "Job target not found" });
    return;
  }

  res.json(target);
});
