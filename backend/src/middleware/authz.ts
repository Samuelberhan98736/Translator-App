import type { NextFunction, Request, Response } from "express";

export function authzMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const parts = token.split(".");

  if (parts.length < 2) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  req.user = {
    id: parts[0] || "anonymous",
    role: (parts[1] as "learner" | "mentor" | "admin") || "learner"
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
