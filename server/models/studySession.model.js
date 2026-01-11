const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudyGroup",
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    topic: { type: String },
    startTime: { type: String },
    duration: { type: Number },
    location: {
      type: String,
      default: "To be decided",
    },
  },
  { timestamps: true }
);

const StudySession = mongoose.model("StudySession", studySessionSchema);
module.exports = { StudySession };
