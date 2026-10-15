const express = require("express");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/uploadMiddleware");
const { Readable } = require("stream");

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

// Upload a design image to Cloudinary
router.post(
  "/upload",
  protect,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Could not upload image.",
        });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image to upload.",
        });
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "palette/designs",
            resource_type: "image",
          },
          (error, uploadedImage) => {
            if (error) {
              reject(error);
            } else {
              resolve(uploadedImage);
            }
          }
        );

        Readable.from(req.file.buffer).pipe(stream);
      });

      return res.status(200).json({
        success: true,
        message: "Image uploaded successfully.",
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Cloudinary upload failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "Image upload failed. Please try again.",
      });
    }
  }
);

module.exports = router;
