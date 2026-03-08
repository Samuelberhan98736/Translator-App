import { Router } from "express";
import { listAuditEvents } from "./audit.service";

export const auditRouter = Router();

auditRouter.get("/events", (_req, res) => {
  const limit = Number(_req.query.limit ?? 50);
  res.json({ events: listAuditEvents(limit) });
});
