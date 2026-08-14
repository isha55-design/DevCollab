const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");

async function getProfile(req, res) {
  const userId = req.user.id;

  const user = await userModel
    .findById(userId)
    .select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  return res.status(200).json({
    user
  });
}

async function updateProfile(req, res) {
  const {
    username,
    bio,
    avatar,
    portfolio,
    github,
    linkedin
  } = req.body;

  // Koi field hai ya nahi
  if (
    username === undefined &&
    bio === undefined &&
    avatar === undefined &&
    portfolio === undefined &&
    github === undefined &&
    linkedin === undefined
  ) {
    return res.status(400).json({
      message: "At least one field is required"
    });
  }

  // Username empty check
  if (username !== undefined && username.trim() === "") {
    return res.status(400).json({
      message: "Username cannot be empty"
    });
  }

  // Username length check
  if (username !== undefined && username.length > 20) {
    return res.status(400).json({
      message: "Username limit only 20 characters"
    });
  }

  // Bio check
  if (bio !== undefined && bio.length > 150) {
    return res.status(400).json({
      message: "Bio cannot be more than 150 characters"
    });
  }

  // Avatar validation
  if (avatar !== undefined) {
    try {
      new URL(avatar);
    } catch (error) {
      return res.status(400).json({
        message: "Invalid avatar URL"
      });
    }
  }

  const userId = req.user.id;

  const user = await userModel.findByIdAndUpdate(
    userId,
    {
      username,
      bio,
      avatar,
      portfolio,
      github,
      linkedin
    },
    { new: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  return res.status(200).json({
    message: "Profile updated successfully",
    user
  });
}

async function deleteAccount(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Get user's posts first
  const userPosts = await postModel
    .find({ owner: userId })
    .select("_id");

  const postIds = userPosts.map((post) => post._id);

  // Delete user's posts
  await postModel.deleteMany({
    owner: userId,
  });

  // Delete:
  // 1. comments written by the user
  // 2. comments written on the user's posts
  await commentModel.deleteMany({
    $or: [
      { user: userId },
      { post: { $in: postIds } },
    ],
  });

  // Finally delete user
  await userModel.findByIdAndDelete(userId);

  return res.status(200).json({
    message: "Account deleted successfully",
  });
}

async function getDevelopers(req, res) {
  const developers = await userModel
    .find({ _id: { $ne: req.user.id } })
    .select("-password");

  return res.status(200).json({
    developers
  });
}

async function getDeveloperById(req, res) {
  const { userId } = req.params;

  const developer = await userModel
    .findById(userId)
    .select("-password -email");

  if (!developer) {
    return res.status(404).json({
      message: "Developer not found"
    });
  }

  const posts = await postModel
    .find({ owner: userId })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    developer,
    posts
  });
}

module.exports = {getProfile, updateProfile, deleteAccount, getDevelopers , getDeveloperById};