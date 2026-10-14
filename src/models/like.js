const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    design: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Design",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// A user can like a design only once
likeSchema.index({ user: 1, design: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;