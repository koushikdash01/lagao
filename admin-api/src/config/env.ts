import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "development-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "8h",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? "rzp_test_TNIkLmGdzO9Bei",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ?? "eQrvEyTijsrgpEn6fzlSYlTr",
};
