import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type UserToken = {
  sub: string;
  email: string;
  role: "user";
};

declare global {
  namespace Express {
    interface Request {
      user?: UserToken;
    }
  }
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as UserToken;
    if (payload.role !== "user") {
      return res.status(403).json({ message: "Customer access required" });
    }
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
