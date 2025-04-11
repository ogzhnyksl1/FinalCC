import express from "express"
import {
  getAllSettings,
  getPublicSettings,
  getSettingByName,
  updateSetting,
  createSetting,
  deleteSetting,
  getSettingsByCategory,
} from "../controllers/settingsController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(protect, admin, getAllSettings).post(protect, admin, createSetting)
router.route("/public").get(getPublicSettings)
router.route("/category/:category").get(protect, admin, getSettingsByCategory)
router
  .route("/:name")
  .get(protect, admin, getSettingByName)
  .put(protect, admin, updateSetting)
  .delete(protect, admin, deleteSetting)

export default router

