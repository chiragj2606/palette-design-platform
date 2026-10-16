const express = require("express");

const {
  createUser,
  getUsers,
  getMe,
  updateMe,
  getUserByUsername,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const {
  followUser,
  unfollowUser,
  getFollowStatus,
} = require("../controllers/followController");

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/profile/:username", getUserByUsername);
// Follow a creator
router.post("/:userId/follow", protect, followUser);

// Unfollow a creator
router.delete("/:userId/follow", protect, unfollowUser);

// Check follow status
router.get("/:userId/follow-status", protect, getFollowStatus);

module.exports = router;