
const User = require("../models/user");
const Design = require("../models/design");
const Comment = require("../models/comment");
const Like = require("../models/like");
const Follow = require("../models/follow");
const Save = require("../models/save");

const getDashboardOverview = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalUsers,
      totalDesigns,
      totalComments,
      totalLikes,
      totalFollows,
      totalSaves,
      newUsersLast7Days,
      recentUsers,
      recentDesigns,
    ] = await Promise.all([
      User.countDocuments(),
      Design.countDocuments(),
      Comment.countDocuments(),
      Like.countDocuments(),
      Follow.countDocuments(),
      Save.countDocuments(),

      User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
      }),

      User.find()
        .select("name username email profileImage role createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      Design.find()
        .select("title category imageUrl likes createdAt creator")
        .populate("creator", "name username")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDesigns,
        totalComments,
        totalLikes,
        totalFollows,
        totalSaves,
        newUsersLast7Days,
      },
      recentUsers,
      recentDesigns,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not load dashboard information.",
    });
  }
};

module.exports = {
  getDashboardOverview,
};
