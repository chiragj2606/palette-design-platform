
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getJobs,
  getJobById,
  createJob,
  getMyPostedJobs,
} = require("../controllers/jobController");

// Public routes
router.get("/", getJobs);
router.get("/my", protect, getMyPostedJobs);
router.get("/:id", getJobById);

// Protected route — login required
router.post("/", protect, createJob);

module.exports = router;
