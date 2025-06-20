// backend/routes/results.js
import express from "express";
import Result from "../models/Result.js";
import { requireRole } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/results
 *  - Only students can submit test results.
 *  - Expects body: { student, exam, answers: [{ questionId, selected }], score }
 *  - Returns the newly created, populated Result document.
 */
router.post(
  "/",
  requireRole("student"),
  async (req, res) => {
    try {
      // Create the result
      const result = await Result.create(req.body);

      // Populate the exam.subject and student.name fields
      await result.populate("exam", "subject");
      await result.populate("student", "name");

      // Respond with 201 Created
      res.status(201).json(result);
    } catch (err) {
      // Send back validation or other errors as 400
      res.status(400).json({ error: err.message });
    }
  }
);

/**
 * GET /api/results
 *  - Only teachers can view all results.
 *  - Returns a list of all results, sorted by creation date (newest first).
 */
router.get(
  "/",
  requireRole("teacher"),
  async (req, res) => {
    try {
      const allResults = await Result.find()
        .populate("student", "name")
        .populate("exam", "subject")
        .sort({ createdAt: -1 });

      res.json(allResults);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * GET /api/results/student/:studentId
 *  - Students and teachers can view a specific student's results.
 *  - Returns that student's past results, sorted by creation date.
 */
router.get(
  "/student/:studentId",
  requireRole("student", "teacher"),
  async (req, res) => {
    try {
      const studentResults = await Result.find({ student: req.params.studentId })
        .populate("exam", "subject")
        .populate("student", "name")
        .sort({ createdAt: -1 });

      res.json(studentResults);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
