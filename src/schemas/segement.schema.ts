import z from "zod";

export const segmentSchema = z.object({
  title: z.string().min(3),
  start: z.int(),
  end: z.int(),
});
