"use client";

import Card from "@/components/ui/Card";
import SkillGapList from "@/components/translate/SkillGapList";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import type { TranslateState } from "@/features/translate/types";

type Props = {
  state: TranslateState;
};

export default function ResultsPanel({ state }: Props) {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-900">Results</h2>

      {state.status === "loading" ? <LoadingSpinner /> : null}

      {state.status === "error" ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          {state.error}
        </p>
      ) : null}

      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Transformed Resume
        </h3>
        <pre className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800">
          {state.result?.transformedResume || "No output yet."}
        </pre>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Skill Gaps
        </h3>
        <SkillGapList skillGaps={state.result?.skillGaps ?? []} />
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Matched Keywords
        </h3>
        {state.result?.matchedKeywords?.length ? (
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {state.result.matchedKeywords.map((keyword) => (
              <li key={keyword}>{keyword}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-600">No keywords identified yet.</p>
        )}
      </section>
    </Card>
  );
}
