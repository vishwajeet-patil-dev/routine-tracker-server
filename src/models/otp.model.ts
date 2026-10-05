import { model, Schema } from "mongoose";

const otpSchema = new Schema({
  otp: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User ",
    required: true,
  },
  expiresAt: { type: Date, required: true },
});

export const OTP = model("OTP", otpSchema);
