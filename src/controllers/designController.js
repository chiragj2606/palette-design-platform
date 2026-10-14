const Design = require("../models/design");

// Create a new design
const createDesign = async (req, res) => {
  try {
    const { title, description, imageUrl, category, tags, tools } = req.body;

    const design = await Design.create({
      title,
      description,
      imageUrl,
      category,
      tags,
      tools,
      creator: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Design created successfully",
      design,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all designs
const getDesigns = async (req, res) => {
  try {
    const designs = await Design.find()
      .populate("creator", "name username profileImage bio skills")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      designs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get a single design by ID
const getDesignById = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id)
      .populate("creator", "name username profileImage");

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    res.status(200).json({
      success: true,
      design,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update a design
const updateDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    // Only the creator can update the design
    if (design.creator.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this design",
      });
    }

    const { title, description, imageUrl, category, tags, tools } = req.body;

    design.title = title ?? design.title;
    design.description = description ?? design.description;
    design.imageUrl = imageUrl ?? design.imageUrl;
    design.category = category ?? design.category;
    design.tags = tags ?? design.tags;
    design.tools = tools ?? design.tools;

    await design.save();

    res.status(200).json({
      success: true,
      message: "Design updated successfully",
      design,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a design
const deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    // Only the creator can delete the design
    if (design.creator.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this design",
      });
    }

    await design.deleteOne();

    res.status(200).json({
      success: true,
      message: "Design deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get designs created by the current user
const getMyDesigns = async (req, res) => {
  try {
    const designs = await Design.find({
      creator: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      designs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDesign,
  getDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
  getMyDesigns,

};