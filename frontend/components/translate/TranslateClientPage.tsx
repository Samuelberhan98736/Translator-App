"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import JobInputPanel from "@/components/translate/JobInputPanel";
import ResultsPanel from "@/components/translate/ResultsPanel";
import ResumeInputPanel from "@/components/translate/ResumeInputPanel";
import { fetchJobsByTitle } from "@/features/job/services/job.service";
import type { JobListing } from "@/features/job/types";
import { getProfile } from "@/features/profile/services/profile.service";
import type { StudentProfile } from "@/features/profile/types";
import { useTranslate } from "@/features/translate/hooks/useTranslate";
import type { TranslateInput } from "@/features/translate/types";

const initialInput: TranslateInput = {
  jobTitle: "",
  jobDescription: "",
  resumeText: "",
  company: "",
  source: "manual",
  opportunityType: "internship",
  schedulePreference: "full-time",
  handshakeUrl: ""
};

export default function TranslateClientPage() {
  const [input, setInput] = useState<TranslateInput>(initialInput);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileStatus, setProfileStatus] = useState<"loading" | "ready" | "error">("loading");
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const { state, runTranslation } = useTranslate();

  useEffect(() => {
    async function loadProfile() {
      try {
        const savedProfile = await getProfile();
        setProfile(savedProfile);
        setInput((current) => ({
          ...current,
          profile: savedProfile,
          jobTitle: current.jobTitle || savedProfile.role,
          opportunityType: current.opportunityType || savedProfile.opportunityType,
          schedulePreference: current.schedulePreference || savedProfile.schedulePreference
        }));
        setProfileStatus("ready");
      } catch {
        setProfileStatus("error");
      }
    }

    void loadProfile();
  }, []);

  async function onSubmit() {
    await runTranslation({
      ...input,
      profile: profile ?? undefined
    });
  }

  async function onSearchJobs() {
    setJobsLoading(true);

    try {
      const nextJobs = await fetchJobsByTitle({
        query: input.jobTitle || profile?.role || "",
        major: profile?.major,
        opportunityType: input.opportunityType ?? profile?.opportunityType,
        schedulePreference: input.schedulePreference ?? profile?.schedulePreference
      });

      setJobs(nextJobs);
    } finally {
      setJobsLoading(false);
    }
  }

  function onSelectJob(job: JobListing) {
    setInput((current) => ({
      ...current,
      jobTitle: job.title,
      company: job.company,
      jobDescription: job.description,
      source: job.source,
      opportunityType: job.opportunityType,
      schedulePreference: job.schedulePreference,
      handshakeUrl: job.url
    }));
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 px-7 py-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-night">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-300/20 via-transparent to-blue-300/10 dark:from-cyan-500/15 dark:to-transparent" />
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-md shadow-cyan-500/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" /><path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Translator Workspace
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Align your resume to student-focused job targets and surface concrete capability gaps.
            </p>
          </div>
        </div>
      </section>

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {profile?.role || "Add your profile preferences"}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {profileStatus === "ready"
              ? `${profile?.major || "No major yet"} | ${profile?.opportunityType || "internship"} | ${profile?.schedulePreference || "full-time"}`
              : profileStatus === "error"
                ? "Unable to load saved profile."
                : "Loading saved student profile..."}
          </p>
        </div>
        <div className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:text-slate-300">
          {profile?.handshakeConnected ? "Handshake Ready" : "Handshake Stub Mode"}
        </div>
      </Card>

      {/* Input panels */}
      <div className="grid gap-5 xl:grid-cols-2">
        <ResumeInputPanel input={input} onChange={setInput} />
        <JobInputPanel
          input={input}
          jobs={jobs}
          jobsLoading={jobsLoading}
          profile={profile}
          onChange={setInput}
          onSearchJobs={onSearchJobs}
          onSelectJob={onSelectJob}
        />
      </div>

      {/* Submit bar */}
      <Card className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          {state.status === "queued" && "Job queued — waiting for worker..."}
          {state.status === "running" && "Running translation with AI..."}
          {(state.status === "idle" || state.status === "success" || state.status === "error") &&
            "Paste your resume, select a role, and run the translation."}
        </div>
        <Button
          onClick={onSubmit}
          disabled={state.status === "queued" || state.status === "running"}
          className="shrink-0"
        >
          {(state.status === "queued" || state.status === "running") ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              {state.status === "queued" ? "Queued..." : "Running..."}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Run Translation
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </span>
          )}
        </Button>
      </Card>

      <ResultsPanel state={state} />
    </div>
  );
}
