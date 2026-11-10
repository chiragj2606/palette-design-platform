
const User = require("../models/user");

const requireAdmin = async (req, res, next) => {
  try {
    // The protect middleware must run before this middleware.
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Check the user's current role in MongoDB.
    const user = await User.findById(req.user.userId).select("role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Administrator access required.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not verify administrator permissions.",
    });
  }
};

module.exports = requireAdmin;
