// routes/feedback.js
import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

// @route   POST /api/feedback
// @desc    Submit feedback
// @access  Private (already protected by requireAuth)
router.post("/", async (req, res) => {
  const { student, comment, rating } = req.body;

  if (!student || !comment || !rating) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const feedback = new Feedback({ student, comment, rating });
    await feedback.save();
    res.status(201).json({ success: true, message: "Feedback submitted." });
  } catch (err) {
    console.error("Feedback error:", err.message);
    res.status(500).json({ error: "Server error while submitting feedback." });
  }
});

export default router;
