
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    headline: {
      type: String,
      trim: true,
      default: "",
      maxlength: 120,
    },

    skills: {
      type: [String],
      default: [],
    },

    // Employer verification information
    employerVerification: {
      status: {
        type: String,
        enum: [
          "not_requested",
          "pending",
          "approved",
          "rejected",
          "revoked",
        ],
        default: "not_requested",
      },

      companyName: {
        type: String,
        trim: true,
        default: "",
      },

      companyWebsite: {
        type: String,
        trim: true,
        default: "",
      },

      companyEmail: {
        type: String,
        lowercase: true,
        trim: true,
        default: "",
      },

      jobTitle: {
        type: String,
        trim: true,
        default: "",
      },

      proofUrl: {
        type: String,
        trim: true,
        default: "",
      },

      notes: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
      },

      submittedAt: {
        type: Date,
        default: null,
      },

      reviewedAt: {
        type: Date,
        default: null,
      },

      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      reviewNote: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
