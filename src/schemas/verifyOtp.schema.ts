import z from "zod";

export const verifyOtpSchema = z.object({
  phoneNumber: z
    .string()
    .length(10, "Phone number must be 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});
