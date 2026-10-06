import type { RequestHandler } from "express";
import { AppError } from "../errors.js";
import { logger } from "../logger.js";
import { OTP } from "../models/otp.model.js";
import { User } from "../models/user.model.js";
import { generateOtpSchema } from "../schemas/signup.schema.js";
import { verifyOtpSchema } from "../schemas/verifyOtp.schema.js";
import { Session } from "../models/session.model.js";
import { randomBytes } from "node:crypto";

export const generateOtp: RequestHandler = async (req, res) => {
  const result = generateOtpSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(400, "Invalid Request Body", result.error.issues);
  }
  const { phoneNumber } = result.data;
  try {
    let user = null;
    user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await User.create({
        phoneNumber,
      });
    }

    // Generate a secure 6-digit numeric OTP
    // const otp = crypto.randomInt(100000, 999999).toString();
    const otp = "123456";
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

    await OTP.create({
      userId: user._id,
      otp,
      expiresAt,
    });

    res.status(200).json({
      message: "OTP generated successfully, valid for 5 minutes",
    });
  } catch (error) {
    logger.error(error);
  }
};

export const verifyOtp: RequestHandler = async (req, res) => {
  const result = verifyOtpSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(400, "Invalid Request Body", result.error.issues);
  }

  const { phoneNumber, otp } = req.body;
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const otpDoc = await OTP.findOne({ userId: user._id, otp }).sort({
    expiresAt: -1,
  });
  if (!otpDoc || otpDoc.expiresAt < new Date()) {
    throw new AppError(400, "Invalid or expired OTP");
  }

  const sessionId = randomBytes(32).toString("hex");
  const next7Days = Date.now() + 7 * 24 * 60 * 60 * 1000;
  await Session.create({
    sessionId,
    userId: user._id,
    expiresAt: next7Days,
  });
  res
    .cookie("session", sessionId, {
      httpOnly: true,
      // secure: true,
      sameSite: "none",
      path: "/",
      maxAge: next7Days,
    })
    .status(200)
    .json({
      message: "OTP verified successfully",
    });
};

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const { session } = req.cookies;
  if (!session) {
    throw new AppError(401, "Unauthorized");
  }

  const sessionDoc = await Session.findOne({ sessionId: session });
  if (!sessionDoc || sessionDoc.expiresAt < new Date()) {
    throw new AppError(401, "Unauthorized");
  }

  const user = await User.findOne({ _id: sessionDoc.userId });
  if (!user) {
    throw new AppError(401, "Unauthorized");
  }

  req.user = { _id: user._id, phoneNumber: user.phoneNumber };
  next();
};
