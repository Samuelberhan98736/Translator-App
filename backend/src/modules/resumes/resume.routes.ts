import { Router } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../../db/client";

const ResumeSchema = z.object({
  resumeText: z.string().min(1),
  title: z.string().min(1).default("Untitled Resume")
});

export const resumeRouter = Router();

// POST /api/resumes — create a new resume with version 1
resumeRouter.post("/", async (req, res) => {
  const parsed = ResumeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const userId = req.user?.id;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { data: resume, error: resumeError } = await supabaseAdmin
    .from("resumes")
    .insert({ user_id: userId, title: parsed.data.title, current_version: 1 })
    .select("*")
    .single();

  if (resumeError || !resume) {
    res.status(500).json({ error: resumeError?.message ?? "Failed to create resume" });
    return;
  }

  const { error: versionError } = await supabaseAdmin
    .from("resume_versions")
    .insert({ resume_id: resume.id, version: 1, extracted_text: parsed.data.resumeText });

  if (versionError) {
    res.status(500).json({ error: versionError.message });
    return;
  }

  res.status(201).json({
    id: resume.id,
    userId: resume.user_id,
    title: resume.title,
    version: 1,
    resumeText: parsed.data.resumeText,
    createdAt: resume.created_at
  });
});

// GET /api/resumes/:resumeId/versions
resumeRouter.get("/:resumeId/versions", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  // Verify the resume belongs to this user
  const { data: resume, error: resumeError } = await supabaseAdmin
    .from("resumes")
    .select("id")
    .eq("id", req.params.resumeId)
    .eq("user_id", userId)
    .single();

  if (resumeError || !resume) {
    res.status(404).json({ error: "Resume not found" });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from("resume_versions")
    .select("*")
    .eq("resume_id", req.params.resumeId)
    .order("version", { ascending: false });

  if (error) { res.status(500).json({ error: error.message }); return; }

  res.json(
    (data ?? []).map((v) => ({
      id: v.id,
      resumeId: v.resume_id,
      version: v.version,
      resumeText: v.extracted_text,
      createdAt: v.created_at
    }))
  );
});

// DELETE /api/resumes/:resumeId
resumeRouter.delete("/:resumeId", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { error } = await supabaseAdmin
    .from("resumes")
    .delete()
    .eq("id", req.params.resumeId)
    .eq("user_id", userId);

  if (error) { res.status(500).json({ error: error.message }); return; }

  res.status(204).send();
});
