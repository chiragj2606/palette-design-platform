const mongoose = require("mongoose");

const LearnDailyPackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: String, required: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    pack: { type: mongoose.Schema.Types.Mixed, required: true },
    source: { type: String, default: "openai-responses" },
  },
  { timestamps: true }
);

LearnDailyPackSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports =
  mongoose.models.LearnDailyPack ||
  mongoose.model("LearnDailyPack", LearnDailyPackSchema);
