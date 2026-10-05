import type { RequestHandler } from "express";
import { AppError } from "../errors.js";
import { Segment } from "../models/segment.model.js";
import { segmentSchema } from "../schemas/segement.schema.js";

export const addSegment: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const result = segmentSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(400, "Invalid Request Body", result.error.issues);
  }

  const { title, start, end } = result.data;
  const overlapping = await Segment.findOne({
    userId: req.user._id,
    start: { $lt: end },
    end: { $gt: start },
  });

  if (overlapping) {
    throw new AppError(409, "This time slot overlaps with an existing segment");
  }
  const segment = await Segment.create({
    userId: req.user._id,
    title,
    start,
    end,
  });
  res
    .status(201)
    .json({ message: "Segment Added Successfully.", data: segment });
};

export const getSegments: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }
  const segements = await Segment.find({ userId: req.user._id }).lean();
  res.status(200).json({
    data: segements,
  });
};
