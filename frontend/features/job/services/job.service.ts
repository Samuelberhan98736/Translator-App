import { apiGet } from "@/lib/api";
import type { JobListing } from "@/features/job/types";
import type { OpportunityType, SchedulePreference } from "@/features/profile/types";

type JobSearchFilters = {
  query: string;
  major?: string;
  opportunityType?: OpportunityType;
  schedulePreference?: SchedulePreference;
};

interface SavedJobTarget {
  id: string;
  jobTitle: string;
  jobDescription: string;
  company?: string;
  source: "manual" | "handshake" | "job-search";
  opportunityType?: OpportunityType;
  schedulePreference?: SchedulePreference;
  url?: string;
}

function savedTargetToListing(t: SavedJobTarget): JobListing {
  return {
    id: t.id,
    title: t.jobTitle,
    company: t.company ?? "",
    description: t.jobDescription,
    source: t.source,
    opportunityType: t.opportunityType ?? "job",
    schedulePreference: t.schedulePreference ?? "full-time",
    location: "",
    matchReason: "Previously saved",
    url: t.url
  };
}

export async function fetchJobsByTitle(filters: JobSearchFilters): Promise<JobListing[]> {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("query", filters.query.trim());
  if (filters.major?.trim()) params.set("major", filters.major.trim());
  if (filters.opportunityType) params.set("opportunityType", filters.opportunityType);
  if (filters.schedulePreference) params.set("schedulePreference", filters.schedulePreference);

  const qs = params.toString();

  // Fetch static suggestions + user's saved targets in parallel
  const [suggestions, savedRaw] = await Promise.allSettled([
    apiGet<JobListing[]>(`/api/job-targets/search${qs ? `?${qs}` : ""}`),
    apiGet<SavedJobTarget[]>("/api/job-targets")
  ]);

  const staticJobs = suggestions.status === "fulfilled" ? suggestions.value : [];
  const savedTargets = savedRaw.status === "fulfilled" ? savedRaw.value : [];

  // Convert saved targets to JobListing, filter out any already in static list by title+company
  const staticKeys = new Set(staticJobs.map((j) => `${j.title}|${j.company}`.toLowerCase()));
  const savedListings = savedTargets
    .map(savedTargetToListing)
    .filter((j) => !staticKeys.has(`${j.title}|${j.company}`.toLowerCase()));

  // Apply query filter to saved targets client-side
  const query = filters.query.trim().toLowerCase();
  const filteredSaved = query
    ? savedListings.filter(
        (j) =>
          j.title.toLowerCase().includes(query) ||
          j.description.toLowerCase().includes(query) ||
          j.company.toLowerCase().includes(query)
      )
    : savedListings;

  // Saved targets go first (personalized), then static suggestions
  return [...filteredSaved, ...staticJobs];
}
