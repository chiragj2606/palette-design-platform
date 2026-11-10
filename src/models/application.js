
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    coverLetter: {
      type: String,
      trim: true,
      default: "",
    },

    portfolioLink: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Applied", "Under Review", "Shortlisted", "Rejected"],
      default: "Applied",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from applying to the same job twice.
applicationSchema.index(
  { job: 1, applicant: 1 },
  { unique: true }
);

module.exports = mongoose.model("Application", applicationSchema);
