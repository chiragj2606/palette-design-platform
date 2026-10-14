const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema(
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

// A user can save a design only once
saveSchema.index({ user: 1, design: 1 }, { unique: true });

const Save = mongoose.model("Save", saveSchema);

module.exports = Save;
