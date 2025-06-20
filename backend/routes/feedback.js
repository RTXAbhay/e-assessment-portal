// backend/routes/feedback.js
import express from "express";
import Feedback from "../models/Feedback.js";
import { requireRole } from "../middleware/auth.js";

const router = express.Router();

// 1) Student can POST feedback
router.post("/", async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const student = req.user.id;       // set by requireAuth
    if (!comment || !rating) {
      return res.status(400).json({ error: "Both comment and rating required" });
    }
    const fb = await Feedback.create({ student, comment, rating });
    // populate student name for immediate client use
    await fb.populate("student", "name");
    res.status(201).json(fb);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2) All below require admin
router.use(requireRole("admin"));

// GET all feedback
router.get("/", async (req, res) => {
  const all = await Feedback.find()
    .populate("student", "name")
    .sort({ createdAt: -1 });
  res.json(all);
});

// DELETE one
router.delete("/:id", async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
