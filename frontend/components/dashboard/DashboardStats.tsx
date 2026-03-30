"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

interface Stats {
  translationsCompleted: number;
  skillGapsFound: number;
  keywordsMatched: number;
}

const STATS_CONFIG = [
  {
    key: "translationsCompleted" as const,
    label: "Resumes Translated",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
      </svg>
    )
  },
  {
    key: "skillGapsFound" as const,
    label: "Skill Gaps Found",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </svg>
    )
  },
  {
    key: "keywordsMatched" as const,
    label: "Keywords Matched",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
  }
];

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    apiGet<Stats>("/api/stats")
      .then(setStats)
      .catch(() => setStats({ translationsCompleted: 0, skillGapsFound: 0, keywordsMatched: 0 }));
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {STATS_CONFIG.map((s) => (
        <section
          key={s.key}
          className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-night"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {s.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {stats === null ? (
                  <span className="inline-block h-8 w-10 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                ) : (
                  stats[s.key].toLocaleString()
                )}
              </p>
            </div>
            <div className="rounded-xl bg-cyan-50 p-2 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
              {s.icon}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
