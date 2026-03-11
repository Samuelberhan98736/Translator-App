"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import JobInputPanel from "@/components/translate/JobInputPanel";
import ResultsPanel from "@/components/translate/ResultsPanel";
import ResumeInputPanel from "@/components/translate/ResumeInputPanel";
import { useTranslate } from "@/features/translate/hooks/useTranslate";
import type { TranslateInput } from "@/features/translate/types";

const initialInput: TranslateInput = {
  jobTitle: "",
  jobDescription: "",
  resumeText: "",
  handshakeUrl: ""
};

export default function TranslateClientPage() {
  const [input, setInput] = useState<TranslateInput>(initialInput);
  const { state, runTranslation } = useTranslate();

  async function onSubmit() {
    await runTranslation(input);
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
              Align your resume to any role and surface concrete skill gaps.
            </p>
          </div>
        </div>
      </section>

      {/* Input panels */}
      <div className="grid gap-5 xl:grid-cols-2">
        <ResumeInputPanel input={input} onChange={setInput} />
        <JobInputPanel input={input} onChange={setInput} />
      </div>

      {/* Submit bar */}
      <Card className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          Fill in both panels, then run the translation.
        </div>
        <Button onClick={onSubmit} disabled={state.status === "loading"} className="shrink-0">
          {state.status === "loading" ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Translating...
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
