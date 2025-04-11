import express from "express"
import {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  addGroupManager,
  removeGroupManager,
} from "../controllers/groupController.js"
import { protect, communityManager } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").post(protect, communityManager, createGroup).get(protect, getGroups)

router.route("/:id").get(protect, getGroupById).put(protect, updateGroup).delete(protect, deleteGroup)

router.route("/:id/join").put(protect, joinGroup)
router.route("/:id/leave").put(protect, leaveGroup)
router.route("/:id/managers").put(protect, addGroupManager)
router.route("/:id/managers/:userId").delete(protect, removeGroupManager)

export default router

