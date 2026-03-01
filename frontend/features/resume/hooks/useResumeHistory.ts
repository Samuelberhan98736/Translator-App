"use client";

import { useState } from "react";
import type { ResumeVersion } from "@/features/resume/types";

export function useResumeHistory() {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  return { versions, setVersions };
}
