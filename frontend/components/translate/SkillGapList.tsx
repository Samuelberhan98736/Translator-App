"use client";

import type { CapabilityGap } from "@/features/translate/types";

type Props = {
  capabilityGaps: CapabilityGap[];
};

export default function SkillGapList({ capabilityGaps }: Props) {
  if (capabilityGaps.length === 0) {
    return <p className="text-sm text-slate-600 dark:text-slate-400">No capability gaps identified yet.</p>;
  }

  return (
    <div className="space-y-3">
      {capabilityGaps.map((gap) => (
        <div
          key={gap.capability}
          className={gap.severity === "high"
            ? "rounded-xl border border-rose-200/80 bg-rose-50/50 p-3 dark:border-rose-800/60 dark:bg-rose-900/15"
            : "rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 dark:border-amber-800/60 dark:bg-amber-900/15"}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{gap.capability}</p>
            {gap.severity === "high" ? (
              <span className="rounded-full border border-rose-300/60 bg-rose-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-300">
                high
              </span>
            ) : (
              <span className="rounded-full border border-amber-300/60 bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300">
                medium
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{gap.evidence}</p>
          <p className="mt-2 text-sm font-medium text-cyan-700 dark:text-cyan-300">{gap.recommendation}</p>
        </div>
      ))}
    </div>
  );
}
