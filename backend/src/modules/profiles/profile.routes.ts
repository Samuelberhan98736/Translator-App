import { Router } from "express";
import { StudentProfileSchema, type StudentProfileRecord } from "./profile.types";

const profiles = new Map<string, StudentProfileRecord>();

function getDefaultProfile(userId: string): StudentProfileRecord {
  return {
    userId,
    major: "",
    role: "",
    opportunityType: "internship",
    schedulePreference: "full-time",
    handshakeConnected: false,
    summary: "",
    updatedAt: new Date(0).toISOString()
  };
}

export const profileRouter = Router();

profileRouter.get("/", (req, res) => {
  const userId = req.user?.id ?? "anonymous";
  res.json(profiles.get(userId) ?? getDefaultProfile(userId));
});

profileRouter.put("/", (req, res) => {
  const parsed = StudentProfileSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const userId = req.user?.id ?? "anonymous";
  const profile: StudentProfileRecord = {
    userId,
    ...parsed.data,
    updatedAt: new Date().toISOString()
  };

  profiles.set(userId, profile);
  res.json(profile);
});
