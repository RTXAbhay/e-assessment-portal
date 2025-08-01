// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import examRoutes from "./routes/exams.js";
import resultRoutes from "./routes/results.js";
import adminRoutes from "./routes/admin.js";
import chatRoutes from "./routes/chat.js";
import { requireAuth } from "./middleware/auth.js";
import feedbackRoutes from "./routes/feedback.js";

dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: "*", // Allow requests from any origin (for production, use your frontend URL)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ── Connect to MongoDB ────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ── Test Route (Optional) ─────────────────────────────────────────────────────
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Backend is working 🚀" });
});

// ── Public Auth endpoints ─────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ── Protect the rest with JWT ─────────────────────────────────────────────────
app.use(requireAuth);

// ── Protected routes ──────────────────────────────────────────────────────────
app.use("/api/users", userRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use(requireAuth); // keep this before feedback
app.use("/api/feedback", feedbackRoutes); // <-- Add this!

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
