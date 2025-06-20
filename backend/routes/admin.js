// backend/routes/admin.js
import express from "express";
import User         from "../models/User.js";
import Exam         from "../models/Exam.js";
import Result       from "../models/Result.js";
import Feedback     from "../models/Feedback.js";
import LoginAttempt from "../models/LoginAttempt.js";
import { requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(requireRole("admin"));

// ── Users CRUD ───────────────────────────────────────────────────────────────
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/users/:id", async (req, res) => {
  try {
    const u = await User.findById(req.params.id).select("-password");
    if (!u) return res.status(404).json({ error: "Not found" });
    res.json(u);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/users/:id", async (req, res) => {
  try {
    const u = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");
    res.json(u);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Exams CRUD ───────────────────────────────────────────────────────────────
router.get("/exams", async (req, res) => {
  try {
    const all = await Exam.find();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/exams/:id", async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Results CRUD ─────────────────────────────────────────────────────────────
router.get("/results", async (req, res) => {
  try {
    const all = await Result.find()
      .populate("student", "name")
      .populate("exam", "subject");
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/results/:id", async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Feedback CRUD ────────────────────────────────────────────────────────────
router.get("/feedback", async (req, res) => {
  try {
    const all = await Feedback.find().populate("student", "name");
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/feedback/:id", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── LOGIN ATTEMPTS CRUD ──────────────────────────────────────────────────────
// GET  /api/admin/logins
router.get("/logins", async (req, res) => {
  try {
    const attempts = await LoginAttempt.find()
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE /api/admin/logins/:id
router.delete("/logins/:id", async (req, res) => {
  try {
    await LoginAttempt.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
