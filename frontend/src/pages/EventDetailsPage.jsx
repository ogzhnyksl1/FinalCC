"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  getEventById,
  registerForEvent,
  unregisterFromEvent,
  deleteEvent,
  addEventAnnouncement,
} from "../slices/eventSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import { formatDate } from "../utils/formatDate"
import EventAnalytics from "../components/EventAnalytics"

const EventDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
  const [announcementMessage, setAnnouncementMessage] = useState("")
  const [activeTab, setActiveTab] = useState("details")

  const { loading, error, event, success, message } = useSelector((state) => state.events)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getEventById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (success && message === "Event deleted successfully") {
      navigate("/events")
    }
  }, [success, message, navigate])

  const handleRegisterForEvent = () => {
    dispatch(registerForEvent(id))
  }

  const handleUnregisterFromEvent = () => {
    dispatch(unregisterFromEvent(id))
  }

  const handleDeleteEvent = () => {
    dispatch(deleteEvent(id))
  }

  const handleAddAnnouncement = (e) => {
    e.preventDefault()
    dispatch(addEventAnnouncement({ id, message: announcementMessage }))
    setAnnouncementMessage("")
    setShowAnnouncementForm(false)
  }

  const isUserRegistered = () => {
    return event?.attendees.some((attendee) => attendee._id === userInfo?._id)
  }

  const isEventCreator = () => {
    return event?.creator._id === userInfo?._id
  }

  const isAdmin = userInfo?.role === "admin"
  const isEventManager = userInfo?.role === "eventManager"
  const canManage = isEventCreator() || isAdmin || isEventManager

  const isEventPassed = () => {
    return new Date(event?.date) < new Date()
  }

  const getEventStatus = () => {
    if (isEventPassed()) {
      return "Past"
    }

    const today = new Date()
    const eventDate = new Date(event?.date)

    if (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    ) {
      return "Today"
    }

    return "Upcoming"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : event ? (
        <div>
          {success && message && <Message variant="success">{message}</Message>}

          {/* Event Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {event.image ? (
              <div className="h-64 w-full bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }}>
                <div className="h-full w-full bg-black bg-opacity-30 flex items-end p-6">
                  <h1 className="text-3xl font-bold text-white">{event.title}</h1>
                </div>
              </div>
            ) : (
              <div className="h-48 w-full bg-gradient-to-r from-green-600 to-green-800 flex items-end p-6">
                <h1 className="text-3xl font-bold text-white">{event.title}</h1>
              </div>
            )}

            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <div className="flex flex-wrap items-center text-gray-600 mb-2">
                    <span className="mr-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(event.date)}
                    </span>
                    <span className="mr-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {event.location}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="mr-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {event.attendees?.length || 0} attendees
                      {event.maxAttendees > 0 && ` / ${event.maxAttendees} max`}
                    </span>
                    {event.community && (
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <Link to={`/communities/${event.community._id}`} className="hover:text-green-600">
                          {event.community.name}
                        </Link>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        getEventStatus() === "Past"
                          ? "bg-gray-100 text-gray-800"
                          : getEventStatus() === "Today"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {getEventStatus()}
                    </span>
                    {event.isPrivate && (
                      <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Private</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  {userInfo ? (
                    !isEventPassed() ? (
                      isUserRegistered() ? (
                        <button
                          onClick={handleUnregisterFromEvent}
                          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                        >
                          Cancel Registration
                        </button>
                      ) : (
                        <button
                          onClick={handleRegisterForEvent}
                          disabled={event.maxAttendees > 0 && event.attendees.length >= event.maxAttendees}
                          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {event.maxAttendees > 0 && event.attendees.length >= event.maxAttendees
                            ? "Event Full"
                            : "Register"}
                        </button>
                      )
                    ) : (
                      <span className="text-gray-500">Event has ended</span>
                    )
                  ) : (
                    <Link
                      to="/login"
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Log in to Register
                    </Link>
                  )}
                </div>
              </div>

              {canManage && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to={`/event-manager/edit/${event._id}`}
                    className="bg-green-600 text-white py-1 px-3 rounded-md text-sm hover:bg-green-700 transition-colors"
                  >
                    Edit Event
                  </Link>
                  <button
                    onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                    className="bg-green-600 text-white py-1 px-3 rounded-md text-sm hover:bg-green-700 transition-colors"
                  >
                    {showAnnouncementForm ? "Cancel" : "Add Announcement"}
                  </button>
                  <Link
                    to={`/event-manager/attendees/${event._id}`}
                    className="bg-green-600 text-white py-1 px-3 rounded-md text-sm hover:bg-green-700 transition-colors"
                  >
                    Manage Attendees
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 text-white py-1 px-3 rounded-md text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete Event
                  </button>
                </div>
              )}

              {/* Announcement Form */}
              {showAnnouncementForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Add Announcement</h3>
                  <form onSubmit={handleAddAnnouncement}>
                    <div className="mb-3">
                      <textarea
                        value={announcementMessage}
                        onChange={(e) => setAnnouncementMessage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows="3"
                        placeholder="Enter announcement message..."
                        required
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-green-600 text-white py-1 px-3 rounded-md text-sm hover:bg-green-700 transition-colors"
                      >
                        Send Announcement
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Event Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`py-3 px-4 font-medium ${
                  activeTab === "details"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`py-3 px-4 font-medium ${
                  activeTab === "announcements"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("announcements")}
              >
                Announcements
              </button>
              <button
                className={`py-3 px-4 font-medium ${
                  activeTab === "attendees"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("attendees")}
              >
                Attendees
              </button>
              {canManage && (
                <button
                  className={`py-3 px-4 font-medium ${
                    activeTab === "analytics"
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("analytics")}
                >
                  Analytics
                </button>
              )}
            </div>

            <div className="p-6">
              {/* Details Tab */}
              {activeTab === "details" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{event.description}</p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-2">Organized by</h3>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                        {event.creator?.profilePicture ? (
                          <img
                            src={event.creator.profilePicture || "/placeholder.svg"}
                            alt={event.creator.name}
                            className="h-10 w-10 object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">👤</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{event.creator?.name}</p>
                        <p className="text-sm text-gray-500">{event.creator?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Announcements Tab */}
              {activeTab === "announcements" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Announcements</h2>
                  {event.announcements && event.announcements.length > 0 ? (
                    <div className="space-y-4">
                      {event.announcements.map((announcement) => (
                        <div key={announcement._id} className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium">{announcement.message}</p>
                            <span className="text-xs text-gray-500">{formatDate(announcement.createdAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No announcements yet.</p>
                  )}
                </div>
              )}

              {/* Attendees Tab */}
              {activeTab === "attendees" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Attendees ({event.attendees?.length || 0}){event.maxAttendees > 0 && ` / ${event.maxAttendees}`}
                  </h2>
                  {event.attendees && event.attendees.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {event.attendees.map((attendee) => (
                        <div key={attendee._id} className="flex items-center p-3 bg-gray-50 rounded-md">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                            {attendee.profilePicture ? (
                              <img
                                src={attendee.profilePicture || "/placeholder.svg"}
                                alt={attendee.name}
                                className="h-10 w-10 object-cover"
                              />
                            ) : (
                              <span className="text-gray-500">👤</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{attendee.name}</p>
                            {canManage && <p className="text-xs text-gray-500">{attendee.email}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No attendees yet.</p>
                  )}
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && canManage && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Event Analytics</h2>
                  <EventAnalytics eventId={event._id} />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Message variant="error">Event not found</Message>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Delete Event</h2>
            <p className="mb-6">
              Are you sure you want to delete this event? This action cannot be undone and will remove all
              registrations.
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventDetailsPage

