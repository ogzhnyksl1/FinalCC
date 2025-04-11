import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import Community from "../models/communityModel.js"
import Group from "../models/groupModel.js"
import Event from "../models/eventModel.js"
import Post from "../models/postModel.js"
import Job from "../models/jobModel.js"

// @desc    Search across all entities
// @route   GET /api/search
// @access  Private
const search = asyncHandler(async (req, res) => {
  const { query, type } = req.query

  if (!query) {
    res.status(400)
    throw new Error("Search query is required")
  }

  const searchRegex = new RegExp(query, "i")

  const results = {}

  // Search users
  if (!type || type === "users") {
    const users = await User.find({
      $or: [{ name: searchRegex }, { email: searchRegex }, { bio: searchRegex }],
    }).select("name email profilePicture bio role")

    results.users = users
  }

  // Search communities
  if (!type || type === "communities") {
    const communities = await Community.find({
      $or: [{ name: searchRegex }, { description: searchRegex }],
    }).populate("managers", "name email profilePicture")

    results.communities = communities
  }

  // Search groups
  if (!type || type === "groups") {
    const groups = await Group.find({
      $or: [{ name: searchRegex }, { description: searchRegex }],
    }).populate("community", "name")

    results.groups = groups
  }

  // Search events
  if (!type || type === "events") {
    const events = await Event.find({
      $or: [{ title: searchRegex }, { description: searchRegex }, { location: searchRegex }],
    }).populate("creator", "name email profilePicture")

    results.events = events
  }

  // Search posts
  if (!type || type === "posts") {
    const posts = await Post.find({
      $or: [{ title: searchRegex }, { content: searchRegex }],
    })
      .populate("author", "name email profilePicture")
      .populate("community", "name")
      .populate("group", "name")

    results.posts = posts
  }

  // Search jobs
  if (!type || type === "jobs") {
    const jobs = await Job.find({
      $or: [{ title: searchRegex }, { company: searchRegex }, { location: searchRegex }, { description: searchRegex }],
    }).populate("employer", "name email profilePicture")

    results.jobs = jobs
  }

  res.json(results)
})

export { search }

