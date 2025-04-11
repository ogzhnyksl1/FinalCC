import asyncHandler from "express-async-handler"
import Feedback from "../models/feedbackModel.js"

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
const submitFeedback = asyncHandler(async (req, res) => {
  const { type, subject, message } = req.body

  const feedback = await Feedback.create({
    user: req.user._id,
    type,
    subject,
    message,
  })

  res.status(201).json(feedback)
})

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private/Admin
const getFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({}).populate("user", "name email profilePicture").sort({ createdAt: -1 })

  res.json(feedback)
})

// @desc    Respond to feedback
// @route   PUT /api/feedback/:id/respond
// @access  Private/Admin
const respondToFeedback = asyncHandler(async (req, res) => {
  const { response } = req.body

  const feedback = await Feedback.findById(req.params.id)

  if (feedback) {
    feedback.response = response
    feedback.status = "responded"

    const updatedFeedback = await feedback.save()

    res.json(updatedFeedback)
  } else {
    res.status(404)
    throw new Error("Feedback not found")
  }
})

export { submitFeedback, getFeedback, respondToFeedback }

