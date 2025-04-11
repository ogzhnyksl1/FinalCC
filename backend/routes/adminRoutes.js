import express from "express"
import {
  getAdminStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  resetUserPassword,
} from "../controllers/adminController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/stats").get(protect, admin, getAdminStats)
router.route("/users").get(protect, admin, getUsers)
router
  .route("/users/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser)
router.route("/users/:id/reset-password").put(protect, admin, resetUserPassword)

export default router

