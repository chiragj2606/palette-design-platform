
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    employmentType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Internship", "Freelance", "Contract"],
    },

    experienceLevel: {
      type: String,
      required: true,
      enum: ["Entry-level", "Junior", "Mid-level", "Senior", "Lead"],
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    salary: {
      type: String,
      default: "Not specified",
    },

    workMode: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      default: "On-site",
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
