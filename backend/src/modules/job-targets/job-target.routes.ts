import { Router } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../../db/client";
import { OpportunityTypeSchema, SchedulePreferenceSchema } from "../profiles/profile.types";

const JobTargetSchema = z.object({
  jobTitle: z.string().min(1),
  jobDescription: z.string().min(1),
  company: z.string().trim().optional(),
  source: z.enum(["manual", "handshake", "job-search"]).default("manual"),
  opportunityType: OpportunityTypeSchema.optional(),
  schedulePreference: SchedulePreferenceSchema.optional(),
  url: z.string().url().optional()
});

// Static suggested jobs shown in the "Find Similar Roles" search
const suggestedJobs = [
  {
    id: "handshake-software-intern",
    title: "Software Engineering Intern",
    company: "Peach State Labs",
    description: "Build internal tools, collaborate with engineers, write TypeScript and SQL, and ship product features for university-facing platforms.",
    source: "handshake",
    opportunityType: "internship",
    schedulePreference: "full-time",
    majorTags: ["computer science", "software engineering", "data science"],
    location: "Atlanta, GA",
    url: "https://app.joinhandshake.com/stu/jobs/peach-state-labs"
  },
  {
    id: "handshake-data-analyst",
    title: "Data Analyst",
    company: "Metro Insights",
    description: "Analyze stakeholder requests, build dashboards, use SQL and Python, and translate findings into concise recommendations for operations teams.",
    source: "handshake",
    opportunityType: "job",
    schedulePreference: "full-time",
    majorTags: ["computer science", "information systems", "statistics"],
    location: "Remote",
    url: "https://app.joinhandshake.com/stu/jobs/metro-insights"
  },
  {
    id: "handshake-it-support",
    title: "IT Support Technician",
    company: "Campus Technology Services",
    description: "Support students and staff, triage tickets, document solutions, and troubleshoot device, network, and account issues.",
    source: "handshake",
    opportunityType: "job",
    schedulePreference: "part-time",
    majorTags: ["computer science", "information systems", "cybersecurity"],
    location: "Atlanta, GA",
    url: "https://app.joinhandshake.com/stu/jobs/campus-technology-services"
  },
  {
    id: "jobsearch-product-intern",
    title: "Product Operations Intern",
    company: "LaunchWorks",
    description: "Partner with product managers, review user feedback, track roadmap tasks, and prepare structured updates across business and engineering teams.",
    source: "job-search",
    opportunityType: "internship",
    schedulePreference: "part-time",
    majorTags: ["business", "computer science", "marketing"],
    location: "Hybrid",
    url: "https://jobs.example.com/launchworks/product-operations-intern"
  },
  {
    id: "jobsearch-customer-success",
    title: "Customer Success Associate",
    company: "North Avenue Software",
    description: "Own onboarding tasks, resolve account issues, document recurring patterns, and communicate customer outcomes to product and support teams.",
    source: "job-search",
    opportunityType: "job",
    schedulePreference: "full-time",
    majorTags: ["business", "communications", "computer science"],
    location: "Remote",
    url: "https://jobs.example.com/north-avenue/customer-success-associate"
  }
] as const;

export const jobTargetRouter = Router();

// GET /api/job-targets — list the authenticated user's saved job targets
jobTargetRouter.get("/", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { data, error } = await supabaseAdmin
    .from("job_targets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) { res.status(500).json({ error: error.message }); return; }

  res.json(
    (data ?? []).map((d) => ({
      id: d.id,
      jobTitle: d.job_title,
      jobDescription: d.job_description,
      company: d.company,
      source: d.source,
      opportunityType: d.opportunity_type,
      schedulePreference: d.schedule_preference,
      url: d.url,
      createdAt: d.created_at
    }))
  );
});

// GET /api/job-targets/search — ranked suggested jobs (static list)
jobTargetRouter.get("/search", (req, res) => {
  const query = String(req.query.query ?? "").trim().toLowerCase();
  const major = String(req.query.major ?? "").trim().toLowerCase();
  const opportunityType = String(req.query.opportunityType ?? "").trim().toLowerCase();
  const schedulePreference = String(req.query.schedulePreference ?? "").trim().toLowerCase();

  const ranked = suggestedJobs
    .map((job) => {
      let score = 0;
      if (query && (job.title.toLowerCase().includes(query) || job.description.toLowerCase().includes(query))) score += 3;
      if (major && job.majorTags.some((tag) => tag.includes(major) || major.includes(tag))) score += 2;
      if (opportunityType && job.opportunityType === opportunityType) score += 1;
      if (schedulePreference && job.schedulePreference === schedulePreference) score += 1;
      return { job, score };
    })
    .filter(({ score, job }) => {
      if (!query && !major && !opportunityType && !schedulePreference) return true;
      return score > 0 || job.title.toLowerCase().includes(query);
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ job }) => ({
      ...job,
      matchReason: [
        major ? `Aligned with ${major}` : null,
        opportunityType ? `${job.opportunityType} opportunity` : null,
        schedulePreference ? `${job.schedulePreference} schedule` : null
      ]
        .filter(Boolean)
        .join(" | ")
    }));

  res.json(ranked);
});

// POST /api/job-targets — save a job target to the database
jobTargetRouter.post("/", async (req, res) => {
  const parsed = JobTargetSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const userId = req.user?.id;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { data, error } = await supabaseAdmin
    .from("job_targets")
    .insert({
      user_id: userId,
      job_title: parsed.data.jobTitle,
      job_description: parsed.data.jobDescription,
      company: parsed.data.company ?? null,
      source: parsed.data.source,
      opportunity_type: parsed.data.opportunityType ?? null,
      schedule_preference: parsed.data.schedulePreference ?? null,
      url: parsed.data.url ?? null
    })
    .select("*")
    .single();

  if (error || !data) {
    res.status(500).json({ error: error?.message ?? "Failed to save job target" });
    return;
  }

  res.status(201).json({
    id: data.id,
    userId: data.user_id,
    jobTitle: data.job_title,
    jobDescription: data.job_description,
    company: data.company,
    source: data.source,
    opportunityType: data.opportunity_type,
    schedulePreference: data.schedule_preference,
    url: data.url,
    createdAt: data.created_at
  });
});

// GET /api/job-targets/:id
jobTargetRouter.get("/:id", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { data, error } = await supabaseAdmin
    .from("job_targets")
    .select("*")
    .eq("id", req.params.id)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    res.status(404).json({ error: "Job target not found" });
    return;
  }

  res.json({
    id: data.id,
    userId: data.user_id,
    jobTitle: data.job_title,
    jobDescription: data.job_description,
    company: data.company,
    source: data.source,
    opportunityType: data.opportunity_type,
    schedulePreference: data.schedule_preference,
    url: data.url,
    createdAt: data.created_at
  });
});
