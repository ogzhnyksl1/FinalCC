import asyncHandler from "express-async-handler"
import Community from "../models/communityModel.js"
import User from "../models/userModel.js"
import Post from "../models/postModel.js"
import Settings from "../models/settingsModel.js" // Import Settings model

// @desc    Create a new community
// @route   POST /api/communities
// @access  Private/CommunityManager
const createCommunity = asyncHandler(async (req, res) => {
  const { name, description, image, isPrivate } = req.body

  // Check if user is a community manager or admin
  if (req.user.role !== "communityManager" && req.user.role !== "admin") {
    res.status(403)
    throw new Error("Not authorized to create communities")
  }

  // Check if community with same name exists
  const communityExists = await Community.findOne({ name })
  if (communityExists) {
    res.status(400)
    throw new Error("Community with this name already exists")
  }

  // Check if user has reached max communities limit
  const userCommunities = await Community.find({ managers: req.user._id })
  const settings = await Settings.findOne({ name: "maxCommunitiesPerUser" })
  const maxCommunities = settings ? settings.value : 3

  if (userCommunities.length >= maxCommunities && req.user.role !== "admin") {
    res.status(400)
    throw new Error(`You can only create up to ${maxCommunities} communities`)
  }

  const community = await Community.create({
    name,
    description,
    image: image || "",
    isPrivate: isPrivate || false,
    managers: [req.user._id],
    members: [req.user._id],
  })

  // Add community to user's communities
  const user = await User.findById(req.user._id)
  user.communities.push(community._id)
  await user.save()

  res.status(201).json(community)
})

// @desc    Get all communities
// @route   GET /api/communities
// @access  Private
const getCommunities = asyncHandler(async (req, res) => {
  const communities = await Community.find({}).populate("managers", "name email profilePicture").sort({ createdAt: -1 })

  res.json(communities)
})

// @desc    Get community by ID
// @route   GET /api/communities/:id
// @access  Private
const getCommunityById = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id)
    .populate("managers", "name email profilePicture")
    .populate("members", "name email profilePicture")
    .populate("groups")

  if (community) {
    // Get recent posts for this community
    const posts = await Post.find({ community: community._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("author", "name email profilePicture")

    res.json({
      ...community._doc,
      recentPosts: posts,
    })
  } else {
    res.status(404)
    throw new Error("Community not found")
  }
})

// @desc    Update community
// @route   PUT /api/communities/:id
// @access  Private/CommunityManager
const updateCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id)

  if (community) {
    // Check if user is a manager of this community or an admin
    if (!community.managers.includes(req.user._id) && req.user.role !== "admin") {
      res.status(403)
      throw new Error("Not authorized to update this community")
    }

    community.name = req.body.name || community.name
    community.description = req.body.description || community.description
    community.image = req.body.image || community.image
    community.isPrivate = req.body.isPrivate !== undefined ? req.body.isPrivate : community.isPrivate

    const updatedCommunity = await community.save()
    res.json(updatedCommunity)
  } else {
    res.status(404)
    throw new Error("Community not found")
  }
})

// @desc    Delete community
// @route   DELETE /api/communities/:id
// @access  Private/CommunityManager
const deleteCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id)

  if (community) {
    // Check if user is a manager of this community or an admin
    if (!community.managers.includes(req.user._id) && req.user.role !== "admin") {
      res.status(403)
      throw new Error("Not authorized to delete this community")
    }

    // Remove community from all users
    await User.updateMany({ communities: community._id }, { $pull: { communities: community._id } })

    // Delete all posts in this community
    await Post.deleteMany({ community: community._id })

    await community.remove()
    res.json({ message: "Community removed" })
  } else {
    res.status(404)
    throw new Error("Community not found")
  }
})

// @desc    Join community
// @route   PUT /api/communities/:id/join
// @access  Private
const joinCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id)

  if (community) {
    // Check if user is already a member
    if (community.members.includes(req.user._id)) {
      res.status(400)
      throw new Error("You are already a member of this community")
    }

    // Add user to community members
    community.members.push(req.user._id)
    await community.save()

    // Add community to user's communities
    const user = await User.findById(req.user._id)
    user.communities.push(community._id)
    await user.save()

    res.json({ message: "Joined community successfully" })
  } else {
    res.status(404)
    throw new Error("Community not found")
  }
})

// @desc    Leave community
// @route   PUT /api/communities/:id/leave
// @access  Private
const leaveCommunity = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id)

  if (community) {
    // Check if user is a member
    if (!community.members.includes(req.user._id)) {
      res.status(400)
      throw new Error("You are not a member of this community")
    }

    // Check if user is the only manager
    if (community.managers.includes(req.user._id) && community.managers.length === 1) {
      res.status(400)
      throw new Error("You cannot leave as you are the only manager. Assign another manager first.")
    }

    // Remove user from community members and managers
    community.members = community.members.filter((memberId) => memberId.toString() !== req.user._id.toString())
    community.managers = community.managers.filter((managerId) => managerId.toString() !== req.user._id.toString())
    await community.save()

    // Remove community from user's communities
    const user = await User.findById(req.user._id)
    user.communities = user.communities.filter((communityId) => communityId.toString() !== community._id.toString())
    await user.save()

    res.json({ message: "Left community successfully" })
  } else {
    res.status(404)
    throw new Error("Community not found")
  }
})

// @desc    Add manager to community
// @route   PUT /api/communities/:id/managers
// @access  Private/CommunityManager
const addCommunityManager = asyncHandler(async (req, res) => {
  const { userId } = req.body
  const community = await Community.findById(req.params.id)

  if (community) {
    // Check if user is a manager of this community or an admin
    if (!community.managers.includes(req.user._id) && req.user.role !== "admin") {
      res.status(403)
      throw new Error("Not authorized to add managers to this community")
    }

    // Check if user to add exists
    const userToAdd = await User.findById(userId)
    if (!userToAdd) {
      res.status(404)
      throw new Error("User not found")
    }

    // Check if user is already a manager
    if (community.managers.includes(userId)) {
      res.status(400)
      throw new Error("User is already a manager of this community")
    }

    // Check if user is a member
    if (!community.members.includes(userId)) {
      res.status(400)
      throw new Error("User must be a member of the community first")
    }

    // Add user to community managers
    community.managers.push(userId)
    await community.save()

    res.json({ message: "Manager added successfully" })
  } else {
    res.status(404)
    throw new Error("Community not found")
  }
})

// @desc    Remove manager from community
// @route   DELETE /api/communities/:id/managers/:userId
// @access  Private/CommunityManager
const removeCommunityManager = asyncHandler(async (req, res) => {
  const community = await Community.findById(req.params.id)

  if (community) {
    // Check if user is a manager of this community or an admin
    if (!community.managers.includes(req.user._id) && req.user.role !== "admin") {
      res.status(403)
      throw new Error("Not authorized to remove managers from this community")
    }

    // Check if manager to remove exists
    const managerExists = community.managers.includes(req.params.userId)
    if (!managerExists) {
      res.status(404)
      throw new Error("Manager not found")
    }

    // Check if trying to remove self and is the only manager
    if (req.params.userId === req.user._id.toString() && community.managers.length === 1) {
      res.status(400)
      throw new Error("Cannot remove yourself as the only manager. Assign another manager first.")
    }

    // Remove user from community managers
    community.managers = community.managers.filter((managerId) => managerId.toString() !== req.params.userId)
    await community.save()

    res.json({ message: "Manager removed successfully" })
  } else {
    res.status(404)
    throw new Error("Community not found")
  }
})

export {
  createCommunity,
  getCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  addCommunityManager,
  removeCommunityManager,
}

