import type { RequestHandler } from "express";
import { AppError } from "../errors.js";
import { todoSchema } from "../schemas/todo.schema.js";
import { Todo } from "../models/todo.model.js";

export const addTodo: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }
  const result = todoSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(400, "Invalid Request Body", result.error.issues);
  }

  const { title, scheduledOn, segmentId } = result.data;
  await Todo.create({
    title,
    userId: req.user._id,
    ...(segmentId ? { segmentId } : {}),
    ...(scheduledOn ? { scheduledOn } : {}),
  });
  res.status(201).json({ message: "Tdos Added Successfully." });
};

export const getTodos: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }
  const todos = await Todo.find({ userId: req.user._id }).lean();
  res.status(200).json({
    data: todos,
  });
};
