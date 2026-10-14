const Like = require("../models/like");
const Design = require("../models/design");

// Like a design
const likeDesign = async (req, res) => {
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

    // Check if user already liked this design
    const existingLike = await Like.findOne({
      user: userId,
      design: id,
    });

    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: "You already liked this design",
      });
    }

    // Create like
    await Like.create({
      user: userId,
      design: id,
    });

    // Increase like count
    design.likes += 1;
    await design.save();

    res.status(200).json({
      success: true,
      message: "Design liked successfully",
      likes: design.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Unlike a design
const unlikeDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const like = await Like.findOneAndDelete({
      user: userId,
      design: id,
    });

    if (!like) {
      return res.status(400).json({
        success: false,
        message: "You have not liked this design",
      });
    }

    const design = await Design.findById(id);

    if (design) {
      design.likes = Math.max(0, design.likes - 1);
      await design.save();
    }

    res.status(200).json({
      success: true,
      message: "Design unliked successfully",
      likes: design ? design.likes : 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get designs liked by the logged-in user
const getLikedDesigns = async (req, res) => {
  try {
    const userId = req.user.userId;

    const likes = await Like.find({ user: userId }).select("design");

    const likedDesignIds = likes.map((like) =>
      like.design.toString()
    );

    res.status(200).json({
      success: true,
      likedDesignIds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  likeDesign,
  unlikeDesign,
  getLikedDesigns,
};