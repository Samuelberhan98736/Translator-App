import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { supabaseAdmin } from "./db/client";
import { authzMiddleware, requireRole } from "./middleware/authz";
import { errorHandler } from "./middleware/error-handler";
import { rateLimitMiddleware } from "./middleware/rate-limit";
import { requestIdMiddleware } from "./middleware/request-id";
import { auditRouter } from "./modules/audit/audit.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { jobTargetRouter } from "./modules/job-targets/job-target.routes";
import { profileRouter } from "./modules/profiles/profile.routes";
import { resumeRouter } from "./modules/resumes/resume.routes";
import { statsRouter } from "./modules/stats/stats.routes";
import { transformLegacy } from "./modules/translations/translation.controller";
import { translationRouter } from "./modules/translations/translation.routes";
import { cspMiddleware } from "./security/csp";

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: "1mb" }));
app.use(requestIdMiddleware);
app.use(cspMiddleware);
app.use(rateLimitMiddleware);

app.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/readyz", (_req, res) => {
  res.json({ ready: true });
});

app.get("/healthz/supabase", async (_req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from("profiles").select("count").limit(1);
    if (error) {
      res.status(503).json({ connected: false, error: error.message });
      return;
    }
    res.json({ connected: true, data });
  } catch (err) {
    res.status(503).json({ connected: false, error: err instanceof Error ? err.message : "Unknown error" });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/translations", authzMiddleware, translationRouter);
app.use("/api/resumes", authzMiddleware, resumeRouter);
app.use("/api/job-targets", authzMiddleware, jobTargetRouter);
app.use("/api/profile", authzMiddleware, profileRouter);
app.use("/api/stats", authzMiddleware, statsRouter);
app.use("/api/audit", authzMiddleware, requireRole("admin"), auditRouter);
app.post("/api/translator/transform", transformLegacy);

app.use(errorHandler);
