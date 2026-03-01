"use client";

import { useState } from "react";
import { translateService } from "@/features/translate/services/translate.service";
import type { TranslateInput, TranslateState } from "@/features/translate/types";

const initialState: TranslateState = {
  status: "idle",
  result: null,
  error: null
};

export function useTranslate() {
  const [state, setState] = useState<TranslateState>(initialState);

  async function runTranslation(input: TranslateInput) {
    if (!input.resumeText.trim() || !input.jobTitle.trim() || !input.jobDescription.trim()) {
      setState({
        status: "error",
        result: null,
        error: "Resume text, job title, and job description are required."
      });
      return;
    }

    try {
      setState({ status: "loading", result: null, error: null });
      const result = await translateService(input);
      setState({ status: "success", result, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Translation failed.";
      setState({ status: "error", result: null, error: message });
    }
  }

  return { state, runTranslation };
}
