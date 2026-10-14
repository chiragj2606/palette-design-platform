const express = require("express");

const {
  likeDesign,
  unlikeDesign,
  getLikedDesigns,
} = require("../controllers/likeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Get designs liked by the logged-in user
router.get("/likes/mine", protect, getLikedDesigns);

// Like a design
router.post("/:id/like", protect, likeDesign);

// Unlike a design
router.delete("/:id/like", protect, unlikeDesign);

module.exports = router;
