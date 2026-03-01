"use client";

import { useState } from "react";
import type { JobListing } from "@/features/job/types";

export function useJobSearch() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  return { jobs, setJobs };
}
