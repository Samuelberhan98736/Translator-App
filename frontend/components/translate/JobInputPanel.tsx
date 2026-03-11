"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import type { TranslateInput } from "@/features/translate/types";

type Props = {
  input: TranslateInput;
  onChange: (next: TranslateInput) => void;
};

export default function JobInputPanel({ input, onChange }: Props) {
  function update(field: keyof TranslateInput, value: string) {
    onChange({ ...input, [field]: value });
  }

  function importHandshake() {
    // Merge both fields in a single onChange call to avoid stale closure overwriting one with the other
    onChange({
      ...input,
      ...(input.handshakeTitle?.trim() ? { jobTitle: input.handshakeTitle.trim() } : {}),
      ...(input.handshakeDescription?.trim() ? { jobDescription: input.handshakeDescription.trim() } : {})
    });
  }

  return (
    <Card>
      {/* Panel header */}
      <div className="flex items-center gap-2 pb-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Job Target</h2>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="jobTitle">
          Job Title
        </label>
        <Input
          id="jobTitle"
          value={input.jobTitle}
          onChange={(event) => update("jobTitle", event.target.value)}
          placeholder="e.g. FinTech Analyst"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="jobDescription">
          Job Description
        </label>
        <Textarea
          id="jobDescription"
          rows={6}
          value={input.jobDescription}
          onChange={(event) => update("jobDescription", event.target.value)}
          placeholder="Paste target job description"
        />
      </div>

      {/* Handshake section */}
      <div className="space-y-3 rounded-xl border border-dashed border-slate-300/80 bg-slate-50/60 p-4 dark:border-slate-700/60 dark:bg-slate-800/30">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Handshake Import
          </p>
          <Button variant="secondary" onClick={importHandshake} className="h-7 px-3 text-xs">
            Use Handshake Fields
          </Button>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400" htmlFor="handshakeUrl">
            Handshake URL
          </label>
          <Input
            id="handshakeUrl"
            value={input.handshakeUrl ?? ""}
            onChange={(event) => update("handshakeUrl", event.target.value)}
            placeholder="https://app.joinhandshake.com/..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400" htmlFor="handshakeTitle">
            Handshake Title
          </label>
          <Input
            id="handshakeTitle"
            value={input.handshakeTitle ?? ""}
            onChange={(event) => update("handshakeTitle", event.target.value)}
            placeholder="Title from Handshake listing"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400" htmlFor="handshakeDescription">
            Handshake Description
          </label>
          <Textarea
            id="handshakeDescription"
            rows={3}
            value={input.handshakeDescription ?? ""}
            onChange={(event) => update("handshakeDescription", event.target.value)}
            placeholder="Description from Handshake listing"
          />
        </div>
      </div>
    </Card>
  );
}
