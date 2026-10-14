const express = require("express");

const {
  createDesign,
  getDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
  getMyDesigns,

} = require("../controllers/designController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all designs
router.get("/", getDesigns);

router.get("/my-designs", protect, getMyDesigns);

router.get("/:id", getDesignById);

router.post("/", protect, createDesign);

router.put("/:id", protect, updateDesign);

router.delete("/:id", protect, deleteDesign);

module.exports = router;
