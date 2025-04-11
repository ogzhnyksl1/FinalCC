import asyncHandler from "express-async-handler"
import Group from "../models/groupModel.js"
import Community from "../models/communityModel.js"
import User from "../models/userModel.js"
import Post from "../models/postModel.js"

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private/CommunityManager
const createGroup = asyncHandler(async (req, res) => {
  const { name, description, image, community, isPrivate } = req.body

  // Check if community exists
  const communityExists = await Community.findById(community)
  if (!communityExists) {
    res.status(404)
    throw new Error("Community not found")
  }

  // Check if user is a manager of the community or an admin
  if (!communityExists.managers.includes(req.user._id) && req.user.role !== "admin") {
    res.status(403)
    throw new Error("Not authorized to create groups in this community")
  }

  // Check if group with same name exists in the community
  const groupExists = await Group.findOne({ name, community })
  if (groupExists) {
    res.status(400)
    throw new Error("Group with this name already exists in the community")
  }

  const group = await Group.create({
    name,
    description,
    image: image || "",
    community,
    isPrivate: isPrivate || false,
    managers: [req.user._id],
    members: [req.user._id],
  })

  // Add group to community
  communityExists.groups.push(group._id)
  await communityExists.save()

  // Add group to user's groups
  const user = await User.findById(req.user._id)
  user.groups.push(group._id)
  await user.save()

  res.status(201).json(group)
})

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private
const getGroups = asyncHandler(async (req, res) => {
  const { community } = req.query

  const filter = {}
  if (community) {
    filter.community = community
  }

  const groups = await Group.find(filter)
    .populate("community", "name")
    .populate("managers", "name email profilePicture")
    .sort({ createdAt: -1 })

  res.json(groups)
})

// @desc    Get group by ID
// @route   GET /api/groups/:id
// @access  Private
const getGroupById = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)
    .populate("community", "name description image")
    .populate("managers", "name email profilePicture")
    .populate("members", "name email profilePicture")

  if (group) {
    // Get recent posts for this group
    const posts = await Post.find({ group: group._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("author", "name email profilePicture")

    res.json({
      ...group._doc,
      recentPosts: posts,
    })
  } else {
    res.status(404)
    throw new Error("Group not found")
  }
})

// @desc    Update group
// @route   PUT /api/groups/:id
// @access  Private/CommunityManager
const updateGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)

  if (group) {
    // Check if user is a manager of this group or the community, or an admin
    const community = await Community.findById(group.community)
    if (
      !group.managers.includes(req.user._id) &&
      !community.managers.includes(req.user._id) &&
      req.user.role !== "admin"
    ) {
      res.status(403)
      throw new Error("Not authorized to update this group")
    }

    group.name = req.body.name || group.name
    group.description = req.body.description || group.description
    group.image = req.body.image || group.image
    group.isPrivate = req.body.isPrivate !== undefined ? req.body.isPrivate : group.isPrivate

    const updatedGroup = await group.save()
    res.json(updatedGroup)
  } else {
    res.status(404)
    throw new Error("Group not found")
  }
})

// @desc    Delete group
// @route   DELETE /api/groups/:id
// @access  Private/CommunityManager
const deleteGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)

  if (group) {
    // Check if user is a manager of this group or the community, or an admin
    const community = await Community.findById(group.community)
    if (
      !group.managers.includes(req.user._id) &&
      !community.managers.includes(req.user._id) &&
      req.user.role !== "admin"
    ) {
      res.status(403)
      throw new Error("Not authorized to delete this group")
    }

    // Remove group from community
    await Community.updateOne({ _id: group.community }, { $pull: { groups: group._id } })

    // Remove group from all users
    await User.updateMany({ groups: group._id }, { $pull: { groups: group._id } })

    // Delete all posts in this group
    await Post.deleteMany({ group: group._id })

    await group.remove()
    res.json({ message: "Group removed" })
  } else {
    res.status(404)
    throw new Error("Group not found")
  }
})

// @desc    Join group
// @route   PUT /api/groups/:id/join
// @access  Private
const joinGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)

  if (group) {
    // Check if user is already a member
    if (group.members.includes(req.user._id)) {
      res.status(400)
      throw new Error("You are already a member of this group")
    }

    // Check if user is a member of the parent community
    const community = await Community.findById(group.community)
    if (!community.members.includes(req.user._id)) {
      res.status(400)
      throw new Error("You must be a member of the community first")
    }

    // Add user to group members
    group.members.push(req.user._id)
    await group.save()

    // Add group to user's groups
    const user = await User.findById(req.user._id)
    user.groups.push(group._id)
    await user.save()

    res.json({ message: "Joined group successfully" })
  } else {
    res.status(404)
    throw new Error("Group not found")
  }
})

// @desc    Leave group
// @route   PUT /api/groups/:id/leave
// @access  Private
const leaveGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)

  if (group) {
    // Check if user is a member
    if (!group.members.includes(req.user._id)) {
      res.status(400)
      throw new Error("You are not a member of this group")
    }

    // Check if user is the only manager
    if (group.managers.includes(req.user._id) && group.managers.length === 1) {
      res.status(400)
      throw new Error("You cannot leave as you are the only manager. Assign another manager first.")
    }

    // Remove user from group members and managers
    group.members = group.members.filter((memberId) => memberId.toString() !== req.user._id.toString())
    group.managers = group.managers.filter((managerId) => managerId.toString() !== req.user._id.toString())
    await group.save()

    // Remove group from user's groups
    const user = await User.findById(req.user._id)
    user.groups = user.groups.filter((groupId) => groupId.toString() !== group._id.toString())
    await user.save()

    res.json({ message: "Left group successfully" })
  } else {
    res.status(404)
    throw new Error("Group not found")
  }
})

// @desc    Add manager to group
// @route   PUT /api/groups/:id/managers
// @access  Private/CommunityManager
const addGroupManager = asyncHandler(async (req, res) => {
  const { userId } = req.body
  const group = await Group.findById(req.params.id)

  if (group) {
    // Check if user is a manager of this group or the community, or an admin
    const community = await Community.findById(group.community)
    if (
      !group.managers.includes(req.user._id) &&
      !community.managers.includes(req.user._id) &&
      req.user.role !== "admin"
    ) {
      res.status(403)
      throw new Error("Not authorized to add managers to this group")
    }

    // Check if user to add exists
    const userToAdd = await User.findById(userId)
    if (!userToAdd) {
      res.status(404)
      throw new Error("User not found")
    }

    // Check if user is already a manager
    if (group.managers.includes(userId)) {
      res.status(400)
      throw new Error("User is already a manager of this group")
    }

    // Check if user is a member
    if (!group.members.includes(userId)) {
      res.status(400)
      throw new Error("User must be a member of the group first")
    }

    // Add user to group managers
    group.managers.push(userId)
    await group.save()

    res.json({ message: "Manager added successfully" })
  } else {
    res.status(404)
    throw new Error("Group not found")
  }
})

// @desc    Remove manager from group
// @route   DELETE /api/groups/:id/managers/:userId
// @access  Private/CommunityManager
const removeGroupManager = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)

  if (group) {
    // Check if user is a manager of this group or the community, or an admin
    const community = await Community.findById(group.community)
    if (
      !group.managers.includes(req.user._id) &&
      !community.managers.includes(req.user._id) &&
      req.user.role !== "admin"
    ) {
      res.status(403)
      throw new Error("Not authorized to remove managers from this group")
    }

    // Check if manager to remove exists
    const managerExists = group.managers.includes(req.params.userId)
    if (!managerExists) {
      res.status(404)
      throw new Error("Manager not found")
    }

    // Check if trying to remove self and is the only manager
    if (req.params.userId === req.user._id.toString() && group.managers.length === 1) {
      res.status(400)
      throw new Error("Cannot remove yourself as the only manager. Assign another manager first.")
    }

    // Remove user from group managers
    group.managers = group.managers.filter((managerId) => managerId.toString() !== req.params.userId)
    await group.save()

    res.json({ message: "Manager removed successfully" })
  } else {
    res.status(404)
    throw new Error("Group not found")
  }
})

export {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  addGroupManager,
  removeGroupManager,
}

