
const mongoose = require("mongoose");
const User = require("../models/user");
const Follow = require("../models/follow");

// Follow a creator
const followUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(followingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid creator ID",
      });
    }

    if (String(followerId) === String(followingId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const creator = await User.findById(followingId).select("_id");

    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    try {
      await Follow.create({
        follower: followerId,
        following: followingId,
      });
    } catch (error) {
      // A repeated follow request must not create duplicates.
      if (error.code === 11000) {
        return res.status(200).json({
          success: true,
          isFollowing: true,
          message: "You already follow this creator",
        });
      }

      throw error;
    }

    const followersCount = await Follow.countDocuments({
      following: followingId,
    });

    return res.status(201).json({
      success: true,
      isFollowing: true,
      followersCount,
      message: "Creator followed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not follow this creator",
    });
  }
};

// Unfollow a creator
const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(followingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid creator ID",
      });
    }

    await Follow.deleteOne({
      follower: followerId,
      following: followingId,
    });

    const followersCount = await Follow.countDocuments({
      following: followingId,
    });

    return res.status(200).json({
      success: true,
      isFollowing: false,
      followersCount,
      message: "Creator unfollowed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not unfollow this creator",
    });
  }
};

// Check whether the current user follows a creator
const getFollowStatus = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(followingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid creator ID",
      });
    }

    const creator = await User.findById(followingId).select("_id");

    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    const isFollowing = Boolean(
      await Follow.exists({
        follower: followerId,
        following: followingId,
      })
    );

    const followersCount = await Follow.countDocuments({
      following: followingId,
    });

    return res.status(200).json({
      success: true,
      isFollowing,
      followersCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not check follow status",
    });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowStatus,
};
