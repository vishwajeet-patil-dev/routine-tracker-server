import z from "zod";

export const generateOtpSchema = z.object({
  phoneNumber: z
    .string()
    .length(10, "Phone number must be 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});
