import { model, Schema } from "mongoose";

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  segmentId: {
    type: Schema.Types.ObjectId,
    ref: "Segment",
  },
  scheduledOn: {
    type: Date,
    default: null,
  },
  isCompleted: {
    type: Date,
    default: false,
  },
});

export const Todo = model("Todo", todoSchema);
