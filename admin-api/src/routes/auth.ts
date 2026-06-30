import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { query } from "../config/db.js";
import { requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const input = loginSchema.parse(req.body);
    const result = await query<{ id: string; email: string; name: string; password_hash: string }>(
      "select id, email, name, password_hash from admins where email = $1 and is_active = true",
      [input.email],
    );

    const admin = result.rows[0];
    if (!admin || !(await bcrypt.compare(input.password, admin.password_hash))) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const signOptions: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] };
    const token = jwt.sign({ sub: admin.id, email: admin.email, role: "admin" }, env.jwtSecret, signOptions);

    res.json({
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: "admin" },
    });
  }),
);

router.get("/me", requireAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

export default router;
