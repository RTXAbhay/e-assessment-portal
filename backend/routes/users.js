// backend/routes/users.js
import express from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// ▶ Register a teacher or student
// POST /api/users
router.post("/", async (req, res) => {
  const { name, email, password, role, code } = req.body;
  try {
    // You probably already handle teacher-code validation elsewhere
    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ▶ List all users (teachers & students)
// GET /api/users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ▶ GET /api/users/me
//    Returns the currently authenticated user’s profile
router.get("/me", requireAuth, async (req, res) => {
  try {
    // req.user was set by requireAuth to the JWT payload
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
