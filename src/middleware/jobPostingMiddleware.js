
const User = require("../models/user");

const canPostJobs = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Always check current permissions in MongoDB.
    // Never trust a role or approval status from the JWT.
    const user = await User.findById(req.user.userId)
  .select("role employerVerification.status employerVerification.companyName");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }
    // Make the verified database record available to job creation.
req.jobPostingUser = user;

    // Administrators can publish jobs directly.
    if (user.role === "admin") {
      return next();
    }

    const employerStatus =
      user.employerVerification?.status || "not_requested";

    if (employerStatus === "approved") {
      return next();
    }

    const messages = {
      pending:
        "Your employer verification request is awaiting admin approval.",
      rejected:
        "Your employer verification request was rejected. You may submit a new request.",
      revoked:
        "Your employer posting privileges have been revoked.",
      not_requested:
        "You must apply for employer verification before posting jobs.",
    };

    return res.status(403).json({
      success: false,
      message:
        messages[employerStatus] ||
        "You are not authorised to publish jobs.",
      employerStatus,
    });
  } catch (error) {
    console.error("Job posting permission error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not verify job posting permissions.",
    });
  }
};

module.exports = canPostJobs;
