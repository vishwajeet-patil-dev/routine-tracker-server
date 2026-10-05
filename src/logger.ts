import pino, { type LoggerOptions } from "pino";
import { config } from "./config.js";

const options: LoggerOptions = {
  level: config.nodeEnv === "development" ? "debug" : "info",
  redact: {
    paths: [
      "req.headers.cookie",
      "req.headers.authorization",
      'res.headers["set-cookie"]',
    ],
    censor: "[REDACTED]",
  },
};

if (config.nodeEnv === "development") {
  options.transport = { target: "pino-pretty" };
}

export const logger = pino(options);
