import { Router } from "express";
import { supabaseAdmin } from "../../db/client";

export const statsRouter = Router();

// GET /api/stats — per-user aggregates from real DB
statsRouter.get("/", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  // Completed translation jobs for this user
  const { data: jobs, error: jobsError } = await supabaseAdmin
    .from("translation_jobs")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "completed");

  if (jobsError) { res.status(500).json({ error: jobsError.message }); return; }

  const translationsCompleted = jobs?.length ?? 0;

  if (translationsCompleted === 0) {
    res.json({ translationsCompleted: 0, skillGapsFound: 0, keywordsMatched: 0 });
    return;
  }

  const jobIds = jobs!.map((j) => j.id);

  const { data: outputs, error: outputsError } = await supabaseAdmin
    .from("translation_outputs")
    .select("skill_gaps, matched_keywords")
    .in("job_id", jobIds);

  if (outputsError) { res.status(500).json({ error: outputsError.message }); return; }

  const skillGapsFound = (outputs ?? []).reduce(
    (sum, o) => sum + (Array.isArray(o.skill_gaps) ? o.skill_gaps.length : 0),
    0
  );
  const keywordsMatched = (outputs ?? []).reduce(
    (sum, o) => sum + (Array.isArray(o.matched_keywords) ? o.matched_keywords.length : 0),
    0
  );

  res.json({ translationsCompleted, skillGapsFound, keywordsMatched });
});
