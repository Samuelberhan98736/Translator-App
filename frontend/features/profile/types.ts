export type OpportunityType = "job" | "internship";
export type SchedulePreference = "part-time" | "full-time";

export interface StudentProfile {
  major: string;
  role: string;
  opportunityType: OpportunityType;
  schedulePreference: SchedulePreference;
  handshakeConnected: boolean;
  summary: string;
  updatedAt?: string;
}
