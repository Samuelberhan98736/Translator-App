import type { NextFunction, Request, Response } from "express";
import { logger } from "../observability/logger";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const message = err instanceof Error ? err.message : "Unexpected server error";

  logger.error("Unhandled error", {
    requestId: req.requestId,
    message
  });

  res.status(500).json({ error: message, requestId: req.requestId });
}
