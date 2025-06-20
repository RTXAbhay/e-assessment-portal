// backend/models/Chat.js
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  messages: [
    {
      role: { type: String, enum: ["system", "user", "assistant"], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Chat", ChatSchema);
