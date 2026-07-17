import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    console.error("❌ Zod Validation Error:", JSON.stringify(error.flatten(), null, 2));
    return res.status(422).json({ message: "Validation failed", errors: error.flatten() });
  }

  const message = error instanceof Error ? error.message : "Unexpected server error";
  res.status(500).json({ message });
}
