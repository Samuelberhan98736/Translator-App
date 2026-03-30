"use client";

import { useState } from "react";
import { translateService } from "@/features/translate/services/translate.service";
import type { TranslateInput, TranslateState } from "@/features/translate/types";

const initialState: TranslateState = {
  status: "idle",
  jobId: null,
  result: null,
  error: null
};

export function useTranslate() {
  const [state, setState] = useState<TranslateState>(initialState);

  async function runTranslation(input: TranslateInput) {
    if (!input.resumeText.trim() || !input.jobTitle.trim() || !input.jobDescription.trim()) {
      setState({
        status: "error",
        jobId: null,
        result: null,
        error: "Resume text, job title, and job description are required."
      });
      return;
    }

    setState({ status: "queued", jobId: null, result: null, error: null });

    try {
      const result = await translateService(input, (liveStatus) => {
        setState((prev) => ({ ...prev, status: liveStatus }));
      });

      setState({ status: "success", jobId: null, result, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Translation failed.";
      setState({ status: "error", jobId: null, result: null, error: message });
    }
  }

  return { state, runTranslation };
}
