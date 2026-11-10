
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  applyForJob,
  getMyApplications,
} = require("../controllers/applicationController");

// All application routes require login
router.use(protect);

// Submit an application
router.post("/:jobId", applyForJob);

// View your submitted applications
router.get("/my", getMyApplications);

module.exports = router;
