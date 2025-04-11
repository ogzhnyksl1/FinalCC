import express from "express"
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  addEventAnnouncement,
} from "../controllers/eventController.js"
import { protect, eventManager } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").post(protect, eventManager, createEvent).get(protect, getEvents)

router.route("/:id").get(protect, getEventById).put(protect, updateEvent).delete(protect, deleteEvent)

router.route("/:id/register").put(protect, registerForEvent)
router.route("/:id/unregister").put(protect, unregisterFromEvent)
router.route("/:id/announcements").post(protect, addEventAnnouncement)

export default router

