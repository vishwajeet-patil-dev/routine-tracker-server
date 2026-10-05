import { Router } from "express";
import { Session } from "../models/session.model.js";
import { generateOtp, requireAuth, verifyOtp } from "./auth.js";
import { addSegment, getSegments } from "./segment.js";
import { addTodo, getTodos } from "./todo.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.post("/request-otp", generateOtp);
router.post("/verify-otp", verifyOtp);

router.use(requireAuth);

router.post("/add-segment", addSegment);
router.get("/get-segments", getSegments);

router.post("/add-todo", addTodo);
router.get("/get-todos", getTodos);

router.get("/profile", async (req, res) => {
  res.status(200).json({
    message: "Profile Route",
    data: req.user,
  });
});

router.post("/logout", async (req, res) => {
  const sessionDoc = await Session.deleteOne({
    sessionId: req.cookies.session,
  });
  if (sessionDoc) {
    res
      .clearCookie("session", {
        httpOnly: true,
      })
      .status(200)
      .json({
        message: "Logout successful",
      });
  }
});
