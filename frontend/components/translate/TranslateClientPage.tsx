"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import JobInputPanel from "@/components/translate/JobInputPanel";
import ResumeInputPanel from "@/components/translate/ResumeInputPanel";
import ResultsPanel from "@/components/translate/ResultsPanel";
import Button from "@/components/ui/Button";
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
      <Card>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Translator Agent
        </h1>
        <p className="text-sm leading-6 text-slate-700">
          Map resume language to target role expectations.
        </p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <ResumeInputPanel input={input} onChange={setInput} />
        <JobInputPanel input={input} onChange={setInput} />
      </div>

      <Card>
        <Button onClick={onSubmit} disabled={state.status === "loading"}>
          {state.status === "loading" ? "Translating..." : "Run Translation"}
        </Button>
      </Card>

      <ResultsPanel state={state} />
    </div>
  );
}
