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
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Resume Content</h2>

      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="resumeFile">
        Upload Resume
      </label>
      <input
        id="resumeFile"
        className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-sm text-slate-700 transition file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-cyan-600 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:file:bg-cyan-500 dark:hover:file:bg-cyan-400"
        type="file"
        accept=".txt,.md,.pdf,.doc,.docx"
        onChange={(event) => void onFileUpload(event.target.files?.[0])}
      />

      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="resumeText">
        Resume Text
      </label>
      <Textarea
        id="resumeText"
        rows={12}
        value={input.resumeText}
        onChange={(event) => updateResume(event.target.value)}
        placeholder="Paste resume content here"
      />
    </Card>
  );
}
