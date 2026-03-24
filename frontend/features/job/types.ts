export interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string;
  source: "handshake" | "manual" | "job-search";
  opportunityType: "job" | "internship";
  schedulePreference: "part-time" | "full-time";
  location: string;
  matchReason?: string;
  url?: string;
}
