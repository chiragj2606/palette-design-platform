
const User = require("../models/user");

// Get employer verification requests for admin review.
const getEmployerRequests = async (req, res) => {
  try {
    const status = req.query.status || "pending";

    const allowedStatuses = [
      "pending",
      "approved",
      "rejected",
      "revoked",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employer verification status.",
      });
    }

    const users = await User.find({
      "employerVerification.status": status,
    })
      .select(
        "name username email role employerVerification createdAt"
      )
      .sort({
        "employerVerification.submittedAt": -1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      requests: users,
    });
  } catch (error) {
    console.error("Employer request retrieval error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not retrieve employer verification requests.",
    });
  }
};

// Approve, reject, or revoke employer posting privileges.
const reviewEmployerRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, reviewNote = "" } = req.body;

    const allowedActions = [
      "approved",
      "rejected",
      "revoked",
    ];

    if (!allowedActions.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Choose approved, rejected, or revoked.",
      });
    }

    if (
      typeof reviewNote !== "string" ||
      reviewNote.trim().length > 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "Review note must be text with a maximum of 1000 characters.",
      });
    }

    if (
      ["rejected", "revoked"].includes(status) &&
      !reviewNote.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "A reason is required when rejecting or revoking employer access.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const currentStatus =
      user.employerVerification?.status || "not_requested";

    // Approval and rejection are only allowed for pending requests.
    if (
      ["approved", "rejected"].includes(status) &&
      currentStatus !== "pending"
    ) {
      return res.status(409).json({
        success: false,
        message: "Only pending employer requests can be approved or rejected.",
      });
    }

    // Revocation is only allowed for currently approved employers.
    if (
      status === "revoked" &&
      currentStatus !== "approved"
    ) {
      return res.status(409).json({
        success: false,
        message: "Only approved employers can have their privileges revoked.",
      });
    }

    user.employerVerification.status = status;
    user.employerVerification.reviewedAt = new Date();
    user.employerVerification.reviewedBy = req.user.userId;
    user.employerVerification.reviewNote = reviewNote.trim();

    await user.save();

    // Return only safe account fields.
    const updatedUser = await User.findById(user._id)
      .select("name username email role employerVerification")
      .lean();

    return res.status(200).json({
      success: true,
      message: `Employer verification status updated to ${status}.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Employer review error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not update employer verification status.",
    });
  }
};

module.exports = {
  getEmployerRequests,
  reviewEmployerRequest,
};
