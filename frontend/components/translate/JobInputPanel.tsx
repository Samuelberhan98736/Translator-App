"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import type { JobListing } from "@/features/job/types";
import type { StudentProfile } from "@/features/profile/types";
import type { TranslateInput } from "@/features/translate/types";

type Props = {
  input: TranslateInput;
  jobs: JobListing[];
  jobsLoading: boolean;
  profile: StudentProfile | null;
  onChange: (next: TranslateInput) => void;
  onSearchJobs: () => Promise<void>;
  onSelectJob: (job: JobListing) => void;
};

const selectClassName =
  "w-full rounded-xl border border-slate-300 bg-white/85 px-3 py-2 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/25 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20";

export default function JobInputPanel({
  input,
  jobs,
  jobsLoading,
  profile,
  onChange,
  onSearchJobs,
  onSelectJob
}: Props) {
  function update(field: keyof TranslateInput, value: string) {
    onChange({ ...input, [field]: value });
  }

  return (
    <Card>
      {/* Panel header */}
      <div className="flex items-center gap-2 pb-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Job Target</h2>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Role Discovery</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Search similar roles using your saved profile and Handshake-style recommendations.
            </p>
          </div>
          <Button variant="secondary" onClick={() => void onSearchJobs()} disabled={jobsLoading}>
            {jobsLoading ? "Searching..." : "Find Similar Roles"}
          </Button>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="jobTitle">
              Job Role
            </label>
            <Input
              id="jobTitle"
              value={input.jobTitle}
              onChange={(event) => update("jobTitle", event.target.value)}
              placeholder={profile?.role || "e.g. Software Engineering Intern"}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="company">
              Company
            </label>
            <Input
              id="company"
              value={input.company ?? ""}
              onChange={(event) => update("company", event.target.value)}
              placeholder="Optional target company"
            />
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="opportunityType">
              Job vs Internship
            </label>
            <select
              id="opportunityType"
              className={selectClassName}
              value={input.opportunityType ?? profile?.opportunityType ?? "internship"}
              onChange={(event) => onChange({ ...input, opportunityType: event.target.value as "job" | "internship" })}
            >
              <option value="job">Job</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="schedulePreference">
              Part Time vs Full Time
            </label>
            <select
              id="schedulePreference"
              className={selectClassName}
              value={input.schedulePreference ?? profile?.schedulePreference ?? "full-time"}
              onChange={(event) =>
                onChange({ ...input, schedulePreference: event.target.value as "part-time" | "full-time" })
              }
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Suggested Roles
            </p>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {profile?.handshakeConnected ? "Handshake-linked profile" : "Mock Handshake mode"}
            </span>
          </div>
          {jobs.length ? (
            <div className="space-y-2">
              {jobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-left transition hover:border-cyan-300 hover:bg-cyan-50/40 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-cyan-500/50 dark:hover:bg-cyan-500/5"
                  onClick={() => onSelectJob(job)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{job.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {job.company} | {job.location} | {job.source}
                      </p>
                    </div>
                    <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:text-slate-300">
                      {job.opportunityType}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{job.description}</p>
                  {job.matchReason ? (
                    <p className="mt-2 text-xs font-medium text-cyan-700 dark:text-cyan-300">{job.matchReason}</p>
                  ) : null}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No suggested roles yet. Use the profile page to save your major and target role, then search here.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="jobDescription">
          Job Description
        </label>
        <Textarea
          id="jobDescription"
          rows={6}
          value={input.jobDescription}
          onChange={(event) => {
            onChange({ ...input, source: "manual", jobDescription: event.target.value });
          }}
          placeholder="Paste a target job description or choose a suggested role above"
        />
      </div>

    </Card>
  );
}
