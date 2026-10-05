import z from "zod";

export const todoSchema = z.object({
  title: z.string().min(1),
  segmentId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid segment ID")
    .optional(),
  scheduledOn: z.date().optional(),
});
