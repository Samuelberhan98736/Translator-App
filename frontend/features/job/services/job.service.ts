import { apiGet } from "@/lib/api";
import type { JobListing } from "@/features/job/types";
import type { OpportunityType, SchedulePreference } from "@/features/profile/types";

type JobSearchFilters = {
  query: string;
  major?: string;
  opportunityType?: OpportunityType;
  schedulePreference?: SchedulePreference;
};

export async function fetchJobsByTitle(filters: JobSearchFilters): Promise<JobListing[]> {
  const params = new URLSearchParams();

  if (filters.query.trim()) {
    params.set("query", filters.query.trim());
  }

  if (filters.major?.trim()) {
    params.set("major", filters.major.trim());
  }

  if (filters.opportunityType) {
    params.set("opportunityType", filters.opportunityType);
  }

  if (filters.schedulePreference) {
    params.set("schedulePreference", filters.schedulePreference);
  }

  const query = params.toString();
  return apiGet<JobListing[]>(`/api/job-targets/search${query ? `?${query}` : ""}`);
}
