"use client";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import SkillGapList from "@/components/translate/SkillGapList";
import Card from "@/components/ui/Card";
import type { TranslateState } from "@/features/translate/types";

type Props = {
  state: TranslateState;
};

export default function ResultsPanel({ state }: Props) {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Results</h2>

      {state.status === "loading" ? <LoadingSpinner /> : null}

      {state.status === "error" ? (
        <p className="rounded-xl border border-rose-300/60 bg-rose-100/70 px-3 py-2 text-sm font-medium text-rose-700 dark:border-rose-500/40 dark:bg-rose-900/30 dark:text-rose-300">
          {state.error}
        </p>
      ) : null}

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">
          Transformed Resume
        </h3>
        <pre className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          {state.result?.transformedResume || "No output yet."}
        </pre>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">
          Skill Gaps
        </h3>
        <SkillGapList skillGaps={state.result?.skillGaps ?? []} />
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400">
          Matched Keywords
        </h3>
        {state.result?.matchedKeywords?.length ? (
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {state.result.matchedKeywords.map((keyword) => (
              <li key={keyword}>{keyword}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-400">No keywords identified yet.</p>
        )}
      </section>
    </Card>
  );
}
