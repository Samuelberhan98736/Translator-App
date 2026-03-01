export interface JobListing {
  id: string;
  title: string;
  description: string;
  source: "handshake" | "manual";
  url?: string;
}
