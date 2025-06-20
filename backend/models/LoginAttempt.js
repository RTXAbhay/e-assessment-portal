// backend/models/LoginAttempt.js
import mongoose from "mongoose";

const loginAttemptSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  success: {
    type: Boolean,
    required: true
  },
  ip: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true  // will create createdAt & updatedAt
});

export default mongoose.model("LoginAttempt", loginAttemptSchema);
