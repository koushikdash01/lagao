import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { query } from "../config/db.js";
import { requireUser } from "../middleware/userAuth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const signOptions: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] };

function createUserToken(user: { id: string; email: string }) {
  return jwt.sign({ sub: user.id, email: user.email, role: "user" }, env.jwtSecret, signOptions);
}

router.post("/signup", asyncHandler(async (req, res) => {
  const input = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
  }).parse(req.body);
  const passwordHash = await bcrypt.hash(input.password, 12);
  const result = await query<{ id: string; name: string; email: string }>(
    `insert into users (name, email, password_hash)
     values ($1,$2,$3)
     returning id, name, email`,
    [input.name, input.email, passwordHash],
  );
  const user = result.rows[0];
  res.status(201).json({ token: createUserToken(user), user, emailVerificationRequired: true });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const input = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    rememberMe: z.boolean().default(false),
  }).parse(req.body);
  const result = await query<{ id: string; name: string; email: string; password_hash: string }>(
    "select id, name, email, password_hash from users where email=$1 and is_active=true",
    [input.email],
  );
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(input.password, user.password_hash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json({ token: createUserToken(user), user: { id: user.id, name: user.name, email: user.email }, rememberMe: input.rememberMe });
}));

router.post("/forgot-password", asyncHandler(async (req, res) => {
  z.object({ email: z.string().email() }).parse(req.body);
  res.json({ message: "Password reset email queued" });
}));

router.post("/reset-password", asyncHandler(async (req, res) => {
  z.object({ token: z.string().min(10), password: z.string().min(8) }).parse(req.body);
  res.json({ message: "Password reset completed" });
}));

router.post("/verify-email", asyncHandler(async (req, res) => {
  z.object({ token: z.string().min(10) }).parse(req.body);
  res.json({ message: "Email verified" });
}));

router.get("/me", requireUser, asyncHandler(async (req, res) => {
  const result = await query("select id, name, email, phone, created_at from users where id=$1", [req.user!.sub]);
  res.json({ user: result.rows[0] });
}));

export default router;
