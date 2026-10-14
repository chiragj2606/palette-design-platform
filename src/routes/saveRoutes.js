const express = require("express");

const {
  saveDesign,
  unsaveDesign,
  getSavedDesigns,
} = require("../controllers/saveController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/saved", protect, getSavedDesigns);
// Save a design
router.post("/:id/save", protect, saveDesign);

// Remove a saved design
router.delete("/:id/save", protect, unsaveDesign);

module.exports = router;
