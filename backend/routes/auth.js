// backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import LoginAttempt from "../models/LoginAttempt.js";

const router = express.Router();

// ── REGISTER ────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, code } = req.body;

    // teacher & admin codes
    if (role === "teacher" && code !== process.env.TEACHER_CODE) {
      return res.status(401).json({ error: "Invalid teacher code." });
    }
    if (role === "admin" && code !== process.env.ADMIN_CODE) {
      return res.status(401).json({ error: "Invalid admin code." });
    }

    // duplicate email?
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email in use." });
    }

    // hash password & create user
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hash, role });

    // issue JWT with both id and role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name, email, role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── LOGIN (records every attempt) ───────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let success = false;
  const ip        = req.ip;
  const userAgent = req.headers["user-agent"];

  try {
    const user = await User.findOne({ email });
    if (!user) {
      await LoginAttempt.create({ email, success, ip, userAgent });
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      await LoginAttempt.create({ email, success, ip, userAgent });
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // successful login
    success = true;
    await LoginAttempt.create({ email, success, ip, userAgent });

    // issue JWT with id and role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email, role: user.role }
    });
  } catch (err) {
    // record failure if not already recorded
    if (!success) {
      await LoginAttempt.create({ email, success, ip, userAgent });
    }
    res.status(500).json({ error: err.message });
  }
});


export default router;
