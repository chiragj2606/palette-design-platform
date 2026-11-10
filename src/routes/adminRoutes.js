
const express = require("express");

const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const {
  getDashboardOverview,
} = require("../controllers/adminController");

const router = express.Router();

// Dashboard statistics — administrators only
router.get(
  "/overview",
  protect,
  requireAdmin,
  getDashboardOverview
);

module.exports = router;
