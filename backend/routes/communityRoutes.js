import express from "express"
import {
  createCommunity,
  getCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  addCommunityManager,
  removeCommunityManager,
} from "../controllers/communityController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").post(protect, createCommunity).get(protect, getCommunities)

router.route("/:id").get(protect, getCommunityById).put(protect, updateCommunity).delete(protect, deleteCommunity)

router.route("/:id/join").put(protect, joinCommunity)
router.route("/:id/leave").put(protect, leaveCommunity)
router.route("/:id/managers").put(protect, addCommunityManager)
router.route("/:id/managers/:userId").delete(protect, removeCommunityManager)

export default router
