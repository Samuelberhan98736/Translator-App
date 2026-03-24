import { z } from "zod";

export const OpportunityTypeSchema = z.enum(["job", "internship"]);
export const SchedulePreferenceSchema = z.enum(["part-time", "full-time"]);

export const StudentProfileSchema = z.object({
  major: z.string().trim().default(""),
  role: z.string().trim().default(""),
  opportunityType: OpportunityTypeSchema.default("internship"),
  schedulePreference: SchedulePreferenceSchema.default("full-time"),
  handshakeConnected: z.boolean().default(false),
  summary: z.string().trim().default("")
});

export type StudentProfileInput = z.infer<typeof StudentProfileSchema>;

export type StudentProfileRecord = StudentProfileInput & {
  userId: string;
  updatedAt: string;
};
