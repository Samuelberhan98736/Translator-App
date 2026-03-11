import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../db/client";

export async function authzMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  const accessToken = authHeader.replace("Bearer ", "").trim();
  if (!accessToken) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  const roleFromMetadata = data.user.user_metadata?.role;
  const role =
    roleFromMetadata === "admin" || roleFromMetadata === "mentor" ? roleFromMetadata : "learner";

  req.user = {
    id: data.user.id,
    role
  };

  next();
}

export function requireRole(...roles: Array<"learner" | "mentor" | "admin">) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  };
}
