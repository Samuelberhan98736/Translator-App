"use client";

import Card from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import type { TranslateInput } from "@/features/translate/types";

type Props = {
  input: TranslateInput;
  onChange: (next: TranslateInput) => void;
};

export default function ResumeInputPanel({ input, onChange }: Props) {
  function updateResume(value: string) {
    onChange({ ...input, resumeText: value });
  }

  async function onFileUpload(file: File | undefined) {
    if (!file) {
      return;
    }

    const text = await file.text();
    updateResume(text);
  }

  return (
    <Card>
      {/* Panel header */}
      <div className="flex items-center gap-2 pb-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Resume Content</h2>
      </div>

      {/* Upload zone */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="resumeFile">
          Upload File
        </label>
        <label
          htmlFor="resumeFile"
          className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 px-4 py-5 text-center transition hover:border-cyan-400 hover:bg-cyan-50/40 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-cyan-500/60 dark:hover:bg-cyan-500/5"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-slate-500">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Click to upload resume
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">.txt, .md, .pdf, .doc, .docx</p>
          </div>
          <input
            id="resumeFile"
            className="sr-only"
            type="file"
            accept=".txt,.md,.pdf,.doc,.docx"
            onChange={(event) => void onFileUpload(event.target.files?.[0])}
          />
        </label>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="resumeText">
          Or Paste Text
        </label>
        <Textarea
          id="resumeText"
          rows={12}
          value={input.resumeText}
          onChange={(event) => updateResume(event.target.value)}
          placeholder="Paste resume content here"
        />
      </div>
    </Card>
  );
}
