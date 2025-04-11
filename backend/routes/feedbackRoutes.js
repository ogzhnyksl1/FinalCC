import express from "express"
import { submitFeedback, getFeedback, respondToFeedback } from "../controllers/feedbackController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").post(protect, submitFeedback).get(protect, admin, getFeedback)
router.route("/:id/respond").put(protect, admin, respondToFeedback)

export default router

