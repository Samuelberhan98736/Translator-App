"use client";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import SkillGapList from "@/components/translate/SkillGapList";
import Card from "@/components/ui/Card";
import type { TranslateState } from "@/features/translate/types";

type Props = {
  state: TranslateState;
};

export default function ResultsPanel({ state }: Props) {
  const hasResult = state.status === "success" && state.result;

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

      {state.status === "loading" ? <LoadingSpinner /> : null}

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
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">
            Transformed Resume
          </h3>
        </div>
        <pre className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 whitespace-pre-wrap text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
          {state.result?.transformedResume || "No output yet."}
        </pre>
      </section>

      {/* Two-col layout for gaps + keywords */}
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">
              Skill Gaps
            </h3>
          </div>
          <SkillGapList skillGaps={state.result?.skillGaps ?? []} />
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
