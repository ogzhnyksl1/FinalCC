import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("connections", "name email profilePicture")
    .populate("groups", "name description image")
    .populate("events", "title description date location")

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.profilePicture = req.body.profilePicture || user.profilePicture
    user.bio = req.body.bio || user.bio
    user.preferences = req.body.preferences || user.preferences
    user.resume = req.body.resume || user.resume

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      bio: updatedUser.bio,
      resume: updatedUser.resume,
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Get user connections
// @route   GET /api/users/connections
// @access  Private
const getUserConnections = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("connections", "name email profilePicture bio")

  if (user) {
    res.json(user.connections)
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Connect with user
// @route   PUT /api/users/:id/connect
// @access  Private
const connectWithUser = asyncHandler(async (req, res) => {
  const userToConnect = await User.findById(req.params.id)
  const currentUser = await User.findById(req.user._id)

  if (userToConnect && currentUser) {
    // Check if already connected
    if (currentUser.connections.includes(userToConnect._id)) {
      res.status(400)
      throw new Error("Already connected with this user")
    }

    // Add to each other's connections
    currentUser.connections.push(userToConnect._id)
    userToConnect.connections.push(currentUser._id)

    await currentUser.save()
    await userToConnect.save()

    // Add notification for the other user
    userToConnect.notifications.push({
      message: `${currentUser.name} has connected with you`,
      link: `/users/${currentUser._id}`,
    })
    await userToConnect.save()

    res.json({ message: "Connected successfully" })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Disconnect from user
// @route   PUT /api/users/:id/disconnect
// @access  Private
const disconnectFromUser = asyncHandler(async (req, res) => {
  const userToDisconnect = await User.findById(req.params.id)
  const currentUser = await User.findById(req.user._id)

  if (userToDisconnect && currentUser) {
    // Check if connected
    if (!currentUser.connections.includes(userToDisconnect._id)) {
      res.status(400)
      throw new Error("Not connected with this user")
    }

    // Remove from each other's connections
    currentUser.connections = currentUser.connections.filter((id) => id.toString() !== userToDisconnect._id.toString())
    userToDisconnect.connections = userToDisconnect.connections.filter(
      (id) => id.toString() !== currentUser._id.toString(),
    )

    await currentUser.save()
    await userToDisconnect.save()

    res.json({ message: "Disconnected successfully" })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json(user.notifications)
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    const notification = user.notifications.id(req.params.id)

    if (notification) {
      notification.read = true
      await user.save()
      res.json(user.notifications)
    } else {
      res.status(404)
      throw new Error("Notification not found")
    }
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Upload resume
// @route   POST /api/users/resume
// @access  Private
const uploadResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    // In a real implementation, this would handle file upload
    // For now, we'll just update the resume URL
    user.resume = req.body.resumeUrl
    await user.save()

    res.json({ message: "Resume uploaded successfully", resumeUrl: user.resume })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

export {
  getUserById,
  updateUserProfile,
  getUserConnections,
  connectWithUser,
  disconnectFromUser,
  getUserNotifications,
  markNotificationAsRead,
  uploadResume,
}

