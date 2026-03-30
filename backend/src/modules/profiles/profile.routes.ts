import { Router } from "express";
import { supabaseAdmin } from "../../db/client";
import { StudentProfileSchema, type StudentProfileRecord } from "./profile.types";

export const profileRouter = Router();

// GET /api/profile
profileRouter.get("/", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    // Trigger auto-creates a blank row on sign-up, but fall back gracefully
    const blank: StudentProfileRecord = {
      userId,
      major: "",
      role: "",
      opportunityType: "internship",
      schedulePreference: "full-time",
      handshakeConnected: false,
      summary: "",
      updatedAt: new Date(0).toISOString()
    };
    res.json(blank);
    return;
  }

  const profile: StudentProfileRecord = {
    userId: data.user_id,
    major: data.major,
    role: data.target_role,
    opportunityType: data.opportunity_type,
    schedulePreference: data.schedule_preference,
    handshakeConnected: data.handshake_connected,
    summary: data.summary,
    updatedAt: data.updated_at
  };

  res.json(profile);
});

// PUT /api/profile
profileRouter.put("/", async (req, res) => {
  const parsed = StudentProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const userId = req.user?.id;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update({
      major: parsed.data.major,
      target_role: parsed.data.role,
      opportunity_type: parsed.data.opportunityType,
      schedule_preference: parsed.data.schedulePreference,
      handshake_connected: parsed.data.handshakeConnected,
      summary: parsed.data.summary
    })
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) {
    res.status(500).json({ error: error?.message ?? "Failed to save profile" });
    return;
  }

  const profile: StudentProfileRecord = {
    userId: data.user_id,
    major: data.major,
    role: data.target_role,
    opportunityType: data.opportunity_type,
    schedulePreference: data.schedule_preference,
    handshakeConnected: data.handshake_connected,
    summary: data.summary,
    updatedAt: data.updated_at
  };

  res.json(profile);
});
