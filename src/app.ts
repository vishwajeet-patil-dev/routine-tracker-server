import cookieParser from "cookie-parser";
import express, {
  type ErrorRequestHandler,
  type RequestHandler,
} from "express";
import { pinoHttp } from "pino-http";
import { config } from "./config.js";
import { AppError } from "./errors.js";
import { logger } from "./logger.js";
import { router } from "./routes/index.js";
import cors from "cors";

export const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://routine-tracker-client.onrender.com",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(pinoHttp({ logger }));
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

const notFoundHandler: RequestHandler = (_req, _res) => {
  throw new AppError(404, "Not Found");
};
app.use(notFoundHandler);

const errHandler: ErrorRequestHandler = (err: unknown, req, res, _next) => {
  if (err instanceof AppError) {
    logger.error(err);
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }
  if (err instanceof Error) {
    req.log.error({ err }, "Unhandled error");
  } else {
    req.log.error({ err }, "Unhandled non-Error thrown");
  }

  const body: { error: string; stack?: string } = {
    error: "Internal Server Error",
  };

  if (config.nodeEnv === "development" && err instanceof Error && err.stack) {
    body.stack = err.stack;
  }

  res.status(500).json(body);
};
app.use(errHandler);
