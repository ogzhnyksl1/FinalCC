import asyncHandler from "express-async-handler"
import Event from "../models/eventModel.js"
import User from "../models/userModel.js"
import Settings from "../models/settingsModel.js"

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/EventManager
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, image, maxAttendees, isPrivate, community } = req.body

  // Check if user is an event manager or admin
  if (req.user.role !== "eventManager" && req.user.role !== "admin") {
    res.status(403)
    throw new Error("Not authorized to create events")
  }

  // Check if user has reached max events limit
  const userEvents = await Event.find({ creator: req.user._id })
  const settings = await Settings.findOne({ name: "maxEventsPerUser" })
  const maxEvents = settings ? settings.value : 5

  if (userEvents.length >= maxEvents && req.user.role !== "admin") {
    res.status(400)
    throw new Error(`You can only create up to ${maxEvents} events`)
  }

  const event = await Event.create({
    title,
    description,
    date,
    location,
    image: image || "",
    maxAttendees: maxAttendees || 0,
    isPrivate: isPrivate || false,
    community,
    creator: req.user._id,
    attendees: [req.user._id],
  })

  // Add event to user's events
  const user = await User.findById(req.user._id)
  user.events.push(event._id)
  await user.save()

  res.status(201).json(event)
})

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  const { community } = req.query

  const filter = {}
  if (community) {
    filter.community = community
  }

  const events = await Event.find(filter)
    .populate("creator", "name email profilePicture")
    .populate("community", "name")
    .sort({ date: 1 })

  res.json(events)
})

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Private
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("creator", "name email profilePicture")
    .populate("attendees", "name email profilePicture")
    .populate("community", "name description image")

  if (event) {
    res.json(event)
  } else {
    res.status(404)
    throw new Error("Event not found")
  }
})

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/EventManager
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (event) {
    // Check if user is the creator of this event or an admin
    if (event.creator.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403)
      throw new Error("Not authorized to update this event")
    }

    event.title = req.body.title || event.title
    event.description = req.body.description || event.description
    event.date = req.body.date || event.date
    event.location = req.body.location || event.location
    event.image = req.body.image || event.image
    event.maxAttendees = req.body.maxAttendees !== undefined ? req.body.maxAttendees : event.maxAttendees
    event.isPrivate = req.body.isPrivate !== undefined ? req.body.isPrivate : event.isPrivate
    event.community = req.body.community || event.community

    const updatedEvent = await event.save()
    res.json(updatedEvent)
  } else {
    res.status(404)
    throw new Error("Event not found")
  }
})

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/EventManager
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (event) {
    // Check if user is the creator of this event or an admin
    if (event.creator.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403)
      throw new Error("Not authorized to delete this event")
    }

    // Remove event from all users
    await User.updateMany({ events: event._id }, { $pull: { events: event._id } })

    await event.remove()
    res.json({ message: "Event removed" })
  } else {
    res.status(404)
    throw new Error("Event not found")
  }
})

// @desc    Register for event
// @route   PUT /api/events/:id/register
// @access  Private
const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (event) {
    // Check if event has already passed
    if (new Date(event.date) < new Date()) {
      res.status(400)
      throw new Error("Cannot register for past events")
    }

    // Check if user is already registered
    if (event.attendees.includes(req.user._id)) {
      res.status(400)
      throw new Error("You are already registered for this event")
    }

    // Check if event is at capacity
    if (event.maxAttendees > 0 && event.attendees.length >= event.maxAttendees) {
      res.status(400)
      throw new Error("Event is at full capacity")
    }

    // Add user to event attendees
    event.attendees.push(req.user._id)
    await event.save()

    // Add event to user's events
    const user = await User.findById(req.user._id)
    user.events.push(event._id)
    await user.save()

    res.json({ message: "Registered for event successfully" })
  } else {
    res.status(404)
    throw new Error("Event not found")
  }
})

// @desc    Unregister from event
// @route   PUT /api/events/:id/unregister
// @access  Private
const unregisterFromEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (event) {
    // Check if event has already passed
    if (new Date(event.date) < new Date()) {
      res.status(400)
      throw new Error("Cannot unregister from past events")
    }

    // Check if user is registered
    if (!event.attendees.includes(req.user._id)) {
      res.status(400)
      throw new Error("You are not registered for this event")
    }

    // Check if user is the creator
    if (event.creator.toString() === req.user._id.toString()) {
      res.status(400)
      throw new Error("Event creator cannot unregister")
    }

    // Remove user from event attendees
    event.attendees = event.attendees.filter((attendeeId) => attendeeId.toString() !== req.user._id.toString())
    await event.save()

    // Remove event from user's events
    const user = await User.findById(req.user._id)
    user.events = user.events.filter((eventId) => eventId.toString() !== event._id.toString())
    await user.save()

    res.json({ message: "Unregistered from event successfully" })
  } else {
    res.status(404)
    throw new Error("Event not found")
  }
})

// @desc    Add announcement to event
// @route   POST /api/events/:id/announcements
// @access  Private/EventManager
const addEventAnnouncement = asyncHandler(async (req, res) => {
  const { message } = req.body
  const event = await Event.findById(req.params.id)

  if (event) {
    // Check if user is the creator of this event or an admin
    if (event.creator.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403)
      throw new Error("Not authorized to add announcements to this event")
    }

    event.announcements.push({
      message,
      createdBy: req.user._id,
    })

    await event.save()

    // Notify all attendees
    for (const attendeeId of event.attendees) {
      if (attendeeId.toString() !== req.user._id.toString()) {
        const attendee = await User.findById(attendeeId)
        attendee.notifications.push({
          message: `New announcement for ${event.title}: ${message.substring(0, 50)}${message.length > 50 ? "..." : ""}`,
          link: `/events/${event._id}`,
        })
        await attendee.save()
      }
    }

    res.status(201).json(event.announcements[event.announcements.length - 1])
  } else {
    res.status(404)
    throw new Error("Event not found")
  }
})

export {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  addEventAnnouncement,
}

