// backend/models/Question.js
import { Schema, model, Types } from "mongoose";

const questionSchema = new Schema({
  text:      { type: String, required: true },
  options:   { type: [String], required: true },    // exactly 4 for MCQ
  answer:    { type: String, required: true },
  tags:      { type: [String], default: [] },       // e.g. ["Algebra","Medium"]
  topic:     { type: String, required: true },      // e.g. "Algebra"
  difficulty:{ type: String, enum: ["Easy","Medium","Hard"], required: true },
  createdBy: { type: Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default model("Question", questionSchema);
