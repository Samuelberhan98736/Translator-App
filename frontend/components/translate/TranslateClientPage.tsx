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
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-200/30 to-transparent dark:from-cyan-500/15" />
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Translator Workspace
        </h1>
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
          Align your resume language to the role and surface concrete capability gaps.
        </p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <ResumeInputPanel input={input} onChange={setInput} />
        <JobInputPanel input={input} onChange={setInput} />
      </div>

      <Card className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Submit once all required fields are complete.
        </p>
        <Button onClick={onSubmit} disabled={state.status === "loading"}>
          {state.status === "loading" ? "Translating..." : "Run Translation"}
        </Button>
      </Card>

      <ResultsPanel state={state} />
    </div>
  );
}
