import type { $ZodIssue } from "zod/v4/core";

export class AppError extends Error {
  statusCode: number;
  details?: $ZodIssue[];
  constructor(statusCode: number, message: string, details?: $ZodIssue[]) {
    super(message);
    this.statusCode = statusCode;
    if (details) {
      this.details = details;
    }
  }
}
