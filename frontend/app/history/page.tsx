"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTranslationHistory, type TranslationHistoryItem } from "@/features/translate/services/translate.service";

export default function HistoryPage() {
  const [items, setItems] = useState<TranslationHistoryItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    async function load() {
      try {
        const data = await getTranslationHistory();
        setItems(data);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }
    void load();
  }, []);

  return (
    <div className="space-y-5">

      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 px-7 py-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 dark:shadow-night">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-300/15 via-transparent to-transparent dark:from-violet-500/10" />
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 shadow-md shadow-violet-500/25">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Resume Version History
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Compare translations, track improvements, and restore previous versions.
            </p>
          </div>
        </div>
      </section>

      {/* Loading */}
      {status === "loading" && (
        <div className="flex items-center justify-center py-16 text-sm text-slate-500 dark:text-slate-400">
          <svg className="mr-2 animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading history...
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-300/60 bg-rose-100/70 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-900/20 dark:text-rose-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          Unable to load history. Sign in and try again.
        </div>
      )}

      {/* Empty state */}
      {status === "ready" && items.length === 0 && (
        <section className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300/80 bg-white/60 p-12 text-center backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/40">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">No translations yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
            Your translated resumes will appear here. Run your first translation to get started.
          </p>
          <Link
            href="/translate"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-cyan-600 bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-cyan-500/20 transition hover:bg-cyan-500 dark:border-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
          >
            Start Translating
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </section>
      )}

      {/* History list */}
      {status === "ready" && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <section
              key={item.id}
              className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/75"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.input.jobTitle || "Untitled"}
                    {item.input.company ? (
                      <span className="ml-1.5 font-normal text-slate-500 dark:text-slate-400">
                        @ {item.input.company}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                    {item.input.opportunityType ? ` · ${item.input.opportunityType}` : ""}
                  </p>
                </div>
                <span
                  className={
                    item.status === "completed"
                      ? "rounded-full border border-emerald-300/60 bg-emerald-100/70 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : item.status === "failed"
                        ? "rounded-full border border-rose-300/60 bg-rose-100/70 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-300"
                        : "rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  }
                >
                  {item.status}
                </span>
              </div>

              {item.result && (
                <div className="mt-3 space-y-2">
                  {item.result.matchedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.result.matchedKeywords.slice(0, 8).map((kw) => (
                        <span
                          key={kw}
                          className="rounded-lg border border-cyan-200/80 bg-cyan-50 px-2 py-0.5 text-xs font-medium text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300"
                        >
                          {kw}
                        </span>
                      ))}
                      {item.result.matchedKeywords.length > 8 && (
                        <span className="text-xs text-slate-400">+{item.result.matchedKeywords.length - 8} more</span>
                      )}
                    </div>
                  )}
                  <details className="group">
                    <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-300">
                      View transformed resume
                    </summary>
                    <pre className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 whitespace-pre-wrap text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                      {item.result.transformedResume}
                    </pre>
                  </details>
                </div>
              )}
            </section>
          ))}
        </div>
      )}

    </div>
  );
}
