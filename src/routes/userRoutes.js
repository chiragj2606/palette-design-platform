const express = require("express");

const {
  createUser,
  getUsers,
  getMe,
  updateMe,
  getUserByUsername,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/profile/:username", getUserByUsername);

module.exports = router;