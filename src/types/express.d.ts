import "express";
import type { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId;
        phoneNumber: string;
      };
    }
  }
}
