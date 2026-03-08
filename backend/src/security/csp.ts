import type { NextFunction, Request, Response } from "express";

export function cspMiddleware(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:3000 http://localhost:4000"
  );
  next();
}
