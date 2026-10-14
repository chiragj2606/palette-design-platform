const Save = require("../models/save");
const Design = require("../models/design");

// Save a design
const saveDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if the design exists
    const design = await Design.findById(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    // Check if already saved
    const existingSave = await Save.findOne({
      user: userId,
      design: id,
    });

    if (existingSave) {
      return res.status(400).json({
        success: false,
        message: "You already saved this design",
      });
    }

    await Save.create({
      user: userId,
      design: id,
    });

    res.status(200).json({
      success: true,
      message: "Design saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove a saved design
const unsaveDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const save = await Save.findOneAndDelete({
      user: userId,
      design: id,
    });

    if (!save) {
      return res.status(400).json({
        success: false,
        message: "Design is not saved",
      });
    }

    res.status(200).json({
      success: true,
      message: "Design removed from saves",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all designs saved by the current user
const getSavedDesigns = async (req, res) => {
  try {
    const userId = req.user.userId;

    const savedDesigns = await Save.find({ user: userId })
      .populate({
        path: "design",
        populate: {
          path: "creator",
          select: "name username profileImage",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      savedDesigns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveDesign,
  unsaveDesign,
  getSavedDesigns,
};