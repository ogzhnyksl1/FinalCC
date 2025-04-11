import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import Community from "../models/communityModel.js"
import Event from "../models/eventModel.js"
import Post from "../models/postModel.js"
import Job from "../models/jobModel.js"

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments()
  const communityCount = await Community.countDocuments()
  const eventCount = await Event.countDocuments()
  const postCount = await Post.countDocuments()
  const jobCount = await Job.countDocuments()

  // Get recent users
  const recentUsers = await User.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name email profilePicture role createdAt")

  // Get recent posts
  const recentPosts = await Post.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("author", "name email profilePicture")

  // Get recent events
  const recentEvents = await Event.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("creator", "name email profilePicture")

  res.json({
    userCount,
    communityCount,
    eventCount,
    postCount,
    jobCount,
    recentUsers,
    recentPosts,
    recentEvents,
  })
})

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password")
  res.json(users)
})

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password")

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.role = req.body.role || user.role
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: "User removed" })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Reset user password
// @route   PUT /api/admin/users/:id/reset-password
// @access  Private/Admin
const resetUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.password = req.body.password
    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      message: "Password reset successful",
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

export { getAdminStats, getUsers, getUserById, updateUser, deleteUser, resetUserPassword }

