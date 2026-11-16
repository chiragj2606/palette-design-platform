
const User = require("../models/user");

const isValidHttpsUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
};

// Submit an employer verification request.
const submitEmployerVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const currentStatus =
      user.employerVerification?.status || "not_requested";

    if (currentStatus === "pending") {
      return res.status(409).json({
        success: false,
        message: "Your employer verification request is already pending.",
      });
    }

    if (currentStatus === "approved") {
      return res.status(409).json({
        success: false,
        message: "Your employer account is already approved.",
      });
    }

    if (currentStatus === "revoked") {
      return res.status(403).json({
        success: false,
        message: "Your employer privileges have been revoked. Please contact an administrator.",
      });
    }

    const {
      companyName,
      companyWebsite,
      companyEmail,
      jobTitle,
      proofUrl,
      notes,
    } = req.body;

    if (
      !companyName?.trim() ||
      !companyWebsite?.trim() ||
      !companyEmail?.trim() ||
      !jobTitle?.trim() ||
      !proofUrl?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required employer verification fields.",
      });
    }

    const normalizedEmail = companyEmail.trim().toLowerCase();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid company email address.",
      });
    }

    if (
      !isValidHttpsUrl(companyWebsite.trim()) ||
      !isValidHttpsUrl(proofUrl.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Company website and verification proof must use valid HTTPS URLs.",
      });
    }

    if (
      notes !== undefined &&
      (typeof notes !== "string" || notes.length > 1000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Additional notes must be text with a maximum of 1000 characters.",
      });
    }

    user.employerVerification = {
      status: "pending",
      companyName: companyName.trim(),
      companyWebsite: companyWebsite.trim(),
      companyEmail: normalizedEmail,
      jobTitle: jobTitle.trim(),
      proofUrl: proofUrl.trim(),
      notes: (notes || "").trim(),
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      reviewNote: "",
    };

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Employer verification request submitted successfully. An administrator will review it.",
      employerVerification: user.employerVerification,
    });
  } catch (error) {
    console.error("Employer verification submission error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not submit employer verification request.",
    });
  }
};

// Get the current user's employer verification status.
const getMyEmployerVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("employerVerification");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      employerVerification:
        user.employerVerification || {
          status: "not_requested",
        },
    });
  } catch (error) {
    console.error("Employer verification status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not retrieve employer verification status.",
    });
  }
};

module.exports = {
  submitEmployerVerification,
  getMyEmployerVerification,
};

