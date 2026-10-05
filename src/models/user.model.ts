import { model, Schema } from "mongoose";

const userSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
});

export const User = model("User", userSchema);
