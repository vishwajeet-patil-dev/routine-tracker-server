import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  MONGODB_URI: z.string().min(1),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment variables:", result.error.issues);
  process.exit(1);
}

export const config = {
  port: result.data.PORT,
  nodeEnv: result.data.NODE_ENV,
  mongoURI: result.data.MONGODB_URI,
};
