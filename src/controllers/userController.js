const User = require("../models/user");
const bcrypt = require("bcryptjs");

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, username, email, password, profileImage, bio, skills } =
      req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      profileImage,
      bio,
      skills,
    });

    const userResponse = user.toObject();
delete userResponse.password;

res.status(201).json({
  success: true,
  message: "User created successfully",
  user: userResponse,
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get the currently logged-in user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update the currently logged-in user's profile
const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, username, profileImage, bio, skills } = req.body;

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }
      user.name = name.trim();
    }

    if (username !== undefined) {
      if (typeof username !== "string" || !username.trim()) {
        return res.status(400).json({
          success: false,
          message: "Username cannot be empty",
        });
      }
      user.username = username.trim();
    }

    if (profileImage !== undefined) {
      if (typeof profileImage !== "string") {
        return res.status(400).json({
          success: false,
          message: "Profile image must be a URL string",
        });
      }
      user.profileImage = profileImage.trim();
    }

    if (bio !== undefined) {
      if (typeof bio !== "string") {
        return res.status(400).json({
          success: false,
          message: "Bio must be text",
        });
      }
      user.bio = bio.trim();
    }

    if (skills !== undefined) {
      if (
        !Array.isArray(skills) ||
        !skills.every((skill) => typeof skill === "string")
      ) {
        return res.status(400).json({
          success: false,
          message: "Skills must be a list of text values",
        });
      }

      user.skills = skills.map((skill) => skill.trim()).filter(Boolean);
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "That username is already taken",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a public creator profile by username
const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    }).select("name username profileImage bio skills createdAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getMe,
  updateMe,
  getUserByUsername,
};