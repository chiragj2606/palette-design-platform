const express = require("express");

const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const {
  getDashboardOverview,
} = require("../controllers/adminController");

const {
  exportExcel,
  exportCsv,
} = require("../controllers/adminExportController");

const router = express.Router();

// Admin dashboard statistics
router.get(
  "/overview",
  protect,
  requireAdmin,
  getDashboardOverview
);

// Export complete database as Excel
router.get(
  "/export/excel",
  protect,
  requireAdmin,
  exportExcel
);

// Export complete database as CSV ZIP
router.get(
  "/export/csv",
  protect,
  requireAdmin,
  exportCsv
);

module.exports = router;