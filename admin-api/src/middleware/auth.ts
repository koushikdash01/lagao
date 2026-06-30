import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type AdminToken = {
  sub: string;
  email: string;
  role: "admin";
};

declare global {
  namespace Express {
    interface Request {
      admin?: AdminToken;
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AdminToken;
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
