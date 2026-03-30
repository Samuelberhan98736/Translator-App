"use client";

import { useState } from "react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import SkillGapList from "@/components/translate/SkillGapList";
import Card from "@/components/ui/Card";
import type { TranslateState } from "@/features/translate/types";

type Props = {
  state: TranslateState;
};

export default function ResultsPanel({ state }: Props) {
  const [copied, setCopied] = useState(false);
  const hasResult = state.status === "success" && state.result;

  async function copyResume() {
    const text = state.result?.transformedResume;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Results</h2>
        </div>
        {hasResult && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/60 bg-emerald-100/70 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Complete
          </span>
        )}
      </div>

      {(state.status === "queued" || state.status === "running") ? <LoadingSpinner /> : null}

      {state.status === "error" ? (
        <div className="flex items-start gap-3 rounded-xl border border-rose-300/60 bg-rose-100/70 px-4 py-3 dark:border-rose-500/40 dark:bg-rose-900/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400">
            <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{state.error}</p>
        </div>
      ) : null}

      {/* Transformed Resume */}
      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">
              Transformed Resume
            </h3>
          </div>
          {hasResult && (
            <button
              type="button"
              onClick={() => void copyResume()}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-cyan-500/60 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-300"
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          )}
        </div>
        <pre className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 whitespace-pre-wrap text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
          {state.result?.transformedResume || "No output yet."}
        </pre>
      </section>

      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">
            Student Profile Context
          </h3>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
          {state.result?.profileSummary || "No profile linked yet."}
        </div>
      </section>

      {/* Two-col layout for gaps + keywords */}
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">
              Capability Gaps
            </h3>
          </div>
          <SkillGapList capabilityGaps={state.result?.capabilityGaps ?? []} />
        </section>

        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">
              Matched Keywords
            </h3>
          </div>
          {state.result?.matchedKeywords?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {state.result.matchedKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-lg border border-emerald-200/80 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No keywords identified yet.</p>
          )}
        </section>
      </div>
    </Card>
  );
}
