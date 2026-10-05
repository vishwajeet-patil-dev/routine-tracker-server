import mongoose from "mongoose";
import { app } from "./app.js";
import { config } from "./config.js";
import { connectDB } from "./db.js";
import { logger } from "./logger.js";

async function start() {
  await connectDB();
  logger.info("DB connected");
  const server = app.listen(config.port, () => {
    logger.info({ port: config.port }, "Server running on port ...");
  });
  process.on("SIGTERM", () => {
    logger.info("SIGTERM received, shutting down gracefully");
    server.close(async () => {
      try {
        await mongoose.connection.close();
        logger.info("MongoDB connection closed");
      } catch (err) {
        logger.error(err);
      } finally {
        process.exit(0);
      }
    });
  });
}

start().catch((err) => {
  logger.error(err);
  process.exit(1);
});
