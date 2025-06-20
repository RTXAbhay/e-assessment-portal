// backend/routes/exams.js
import express from "express";
import Exam from "../models/Exam.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { CohereClient } from "cohere-ai";

const router = express.Router();

// 1) Make sure req.user is set on *all* routes here
router.use(requireAuth);

// initialize Cohere client
const cohere = new CohereClient({
  apiKey: process.env.COHERE_API_KEY,
});

/**
 * Helper to get the correct user ID
 */
function getUserId(user) {
  // some auth middlewares attach .id, others ._id
  return user._id?.toString() || user.id?.toString();
}

/**
 * GET all exams.
 * - Teachers see all.
 * - Students see only active exams.
 */
router.get("/", async (req, res) => {
  try {
    const filter = req.user.role === "teacher" ? {} : { active: true };
    const exams = await Exam.find(filter).sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET one exam by ID.
 * Students cannot fetch inactive exams.
 */
router.get("/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Not found" });
    if (!exam.active && req.user.role !== "teacher") {
      return res.status(403).json({ error: "Exam is not available" });
    }
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST create a new exam (teachers only).
 * We always tag it with who created it.
 */
router.post(
  "/",
  requireRole("teacher"),
  async (req, res) => {
    try {
      const creator = getUserId(req.user);
      const payload = {
        ...req.body,
        createdBy: creator,
      };
      const exam = await Exam.create(payload);
      res.status(201).json(exam);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

/**
 * PUT update an existing exam (teachers only).
 */
router.put(
  "/:id",
  requireRole("teacher"),
  async (req, res) => {
    try {
      const updated = await Exam.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: "Not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

/**
 * DELETE an exam (teachers only).
 */
router.delete(
  "/:id",
  requireRole("teacher"),
  async (req, res) => {
    try {
      await Exam.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * POST auto‐generate an exam via Cohere (teachers only).
 * Always sets createdBy, and retries once on parse failure.
 */
router.post(
  "/auto",
  requireRole("teacher"),
  async (req, res) => {
    const { topic, difficulty = "Medium", count = 5 } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const buildPrompt = () => `
Generate exactly ${count} multiple‐choice questions on the topic "${topic}" at ${difficulty} difficulty.
Each question should have 4 options and one correct answer.
Output only a JSON array of objects with keys: text, options, answer.
Example:
[
  {
    "text": "What is X?",
    "options": ["A","B","C","D"],
    "answer": "B"
  }
]
`;

    let raw, questions;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await cohere.generate({
          model: "command",
          prompt: buildPrompt(),
          max_tokens: 800,
          temperature: 0.7,
        });

        if (!response.generations?.length) {
          throw new Error("No generations returned");
        }

        raw = response.generations[0].text
          .trim()
          .replace(/```json\s*/, "")
          .replace(/```$/, "")
          .trim();

        const start = raw.indexOf("[");
        const end = raw.lastIndexOf("]") + 1;
        if (start < 0 || end < 0) {
          throw new Error("Could not find JSON array in response");
        }

        const jsonStr = raw.slice(start, end);
        questions = JSON.parse(jsonStr);

        if (!Array.isArray(questions) || questions.length === 0) {
          throw new Error("Parsed value is not a non-empty array");
        }
        break; // success
      } catch (parseErr) {
        console.warn(`Attempt ${attempt} parse failed: ${parseErr.message}`);
        if (attempt === 2) {
          return res
            .status(502)
            .json({ error: "AI response could not be parsed as JSON" });
        }
      }
    }

    try {
      const creator = getUserId(req.user);
      const payload = {
        subject:   `${topic} (Auto)`,
        questions,
        createdBy: creator,
      };
      const exam = await Exam.create(payload);
      res.status(201).json(exam);
    } catch (dbErr) {
      console.error("DB save error:", dbErr);
      res.status(500).json({ error: dbErr.message });
    }
  }
);

export default router;
