import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { requireAdmin } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import customerAuthRoutes from "./routes/customerAuth.js";
import storefrontRoutes from "./routes/storefront.js";
import shopRoutes from "./routes/shop.js";
import demoRoutes from "./routes/demo.js";
import dashboardRoutes from "./routes/dashboard.js";
import plantRoutes from "./routes/plants.js";
import categoryRoutes from "./routes/categories.js";
import inventoryRoutes from "./routes/inventory.js";
import orderRoutes from "./routes/orders.js";
import customerRoutes from "./routes/customers.js";
import {
  bannerSchema,
  couponSchema,
  createAdminResourceRouter,
  reviewSchema,
} from "./routes/adminResources.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:") || origin === env.corsOrigin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/customer/auth", customerAuthRoutes);
app.use("/api/storefront", storefrontRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/demo", demoRoutes);

app.use("/api/dashboard", requireAdmin, dashboardRoutes);
app.use("/api/plants", requireAdmin, plantRoutes);
app.use("/api/categories", requireAdmin, categoryRoutes);
app.use("/api/inventory", requireAdmin, inventoryRoutes);
app.use("/api/orders", requireAdmin, orderRoutes);
app.use("/api/customers", requireAdmin, customerRoutes);
app.use("/api/coupons", requireAdmin, createAdminResourceRouter("coupons", couponSchema));
app.use("/api/reviews", requireAdmin, createAdminResourceRouter("reviews", reviewSchema));
app.use("/api/banners", requireAdmin, createAdminResourceRouter("banners", bannerSchema));

// Static file serving for Unified 1-Single Deployment
const adminDistPath = path.resolve(__dirname, "../../admin-web/dist");
const customerDistPath = path.resolve(__dirname, "../../customer-web/dist");

if (fs.existsSync(adminDistPath)) {
  app.use("/admin", express.static(adminDistPath));
  app.get("/admin/*", (_req, res) => {
    res.sendFile(path.join(adminDistPath, "index.html"));
  });
}

if (fs.existsSync(customerDistPath)) {
  app.use(express.static(customerDistPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(customerDistPath, "index.html"));
  });
} else {
  app.use(notFound);
  app.use(errorHandler);
}

app.listen(env.port, () => {
  console.log(`Lagao admin API running on http://localhost:${env.port}`);
});

export default app;
