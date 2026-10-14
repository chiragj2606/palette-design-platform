const express = require("express");

const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get comments for a design
router.get("/:id/comments", getComments);

// Add a comment to a design - requires login
router.post("/:id/comments", protect, createComment);

router.patch("/:id/comments/:commentId", protect, updateComment);

router.delete("/:id/comments/:commentId", protect, deleteComment);

module.exports = router;