// backend/models/Exam.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length === 4,
      message: "There must be exactly 4 options"
    }
  },
  answer: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        // `this` refers to the current question document
        return this.options.includes(val);
      },
      message: "Answer must be one of the provided options"
    }
  }
});

const examSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    questions: {
      type: [questionSchema],
      default: []
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true  // adds createdAt and updatedAt fields automatically
  }
);

export default mongoose.model("Exam", examSchema);
