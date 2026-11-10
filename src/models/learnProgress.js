const mongoose = require("mongoose");

const LearnProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    state: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true, minimize: false }
);

module.exports =
  mongoose.models.LearnProgress ||
  mongoose.model("LearnProgress", LearnProgressSchema);
