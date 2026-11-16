
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

const {
  getEmployerRequests,
  reviewEmployerRequest,
} = require("../controllers/employerAdminController");

const router = express.Router();

// Dashboard statistics — administrators only
router.get(
  "/overview",
  protect,
  requireAdmin,
  getDashboardOverview
);

// Complete database exports — administrators only
router.get(
  "/export/excel",
  protect,
  requireAdmin,
  exportExcel
);

router.get(
  "/export/csv",
  protect,
  requireAdmin,
  exportCsv
);

// View employer verification requests
router.get(
  "/employers",
  protect,
  requireAdmin,
  getEmployerRequests
);

// Approve, reject, or revoke employer privileges
router.patch(
  "/employers/:userId/review",
  protect,
  requireAdmin,
  reviewEmployerRequest
);

module.exports = router;
