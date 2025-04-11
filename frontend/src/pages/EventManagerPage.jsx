"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getEvents, createEvent } from "../slices/eventSlice"
import { getCommunities } from "../slices/communitySlice"
import Loader from "../components/Loader"
import Message from "../components/Message"

const EventManagerPage = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState("myEvents")
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [image, setImage] = useState("")
  const [maxAttendees, setMaxAttendees] = useState("")
  const [community, setCommunity] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)

  const { loading, error, events, success } = useSelector((state) => state.events)
  const { communities } = useSelector((state) => state.communities)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getEvents())
    dispatch(getCommunities())
  }, [dispatch])

  useEffect(() => {
    if (success) {
      setShowCreateForm(false)
      resetForm()
    }
  }, [success])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDate("")
    setTime("")
    setLocation("")
    setImage("")
    setMaxAttendees("")
    setCommunity("")
    setIsPrivate(false)
  }

  const handleCreateEvent = (e) => {
    e.preventDefault()

    // Combine date and time for the event
    const eventDateTime = new Date(`${date}T${time}`)

    dispatch(
      createEvent({
        title,
        description,
        date: eventDateTime,
        location,
        image,
        maxAttendees: maxAttendees ? Number(maxAttendees) : 0,
        community: community || undefined,
        isPrivate,
      }),
    )
  }

  // Filter events based on active tab
  const filteredEvents = events?.filter((event) => {
    if (activeTab === "myEvents") {
      return event.creator._id === userInfo._id
    } else if (activeTab === "upcoming") {
      return new Date(event.date) >= new Date()
    } else if (activeTab === "past") {
      return new Date(event.date) < new Date()
    }
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600 mb-4 md:mb-0">Event Manager Dashboard</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          {showCreateForm ? "Cancel" : "Create Event"}
        </button>
      </div>

      {/* Create Event Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create a New Event</h2>
          <form onSubmit={handleCreateEvent}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Attendees (0 for unlimited)
                </label>
                <input
                  type="number"
                  id="maxAttendees"
                  value={maxAttendees}
                  onChange={(e) => setMaxAttendees(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Optional)
              </label>
              <input
                type="text"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-1">
                Community (Optional)
              </label>
              <select
                id="community"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">None (General Event)</option>
                {communities?.map((comm) => (
                  <option key={comm._id} value={comm._id}>
                    {comm.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span className="ml-2 text-gray-700">Private Event</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Private events are only visible to invited attendees and community members.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Event Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-3 px-4 font-medium ${
              activeTab === "myEvents"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("myEvents")}
          >
            My Events
          </button>
          <button
            className={`py-3 px-4 font-medium ${
              activeTab === "upcoming"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
          </button>
          <button
            className={`py-3 px-4 font-medium ${
              activeTab === "past" ? "border-b-2 border-green-600 text-green-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past Events
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">{error}</Message>
          ) : filteredEvents && filteredEvents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Title</th>
                    <th className="py-3 px-6 text-left">Date</th>
                    <th className="py-3 px-6 text-left">Location</th>
                    <th className="py-3 px-6 text-left">Attendees</th>
                    <th className="py-3 px-6 text-left">Community</th>
                    <th className="py-3 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">
                        <Link to={`/events/${event._id}`} className="hover:text-green-600">
                          {event.title}
                        </Link>
                      </td>
                      <td className="py-3 px-6 text-left">
                        {new Date(event.date).toLocaleDateString()}{" "}
                        {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-3 px-6 text-left">{event.location}</td>
                      <td className="py-3 px-6 text-left">
                        {event.attendees?.length || 0}
                        {event.maxAttendees > 0 && ` / ${event.maxAttendees}`}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {event.community ? (
                          <Link to={`/communities/${event.community._id}`} className="hover:text-green-600">
                            {event.community.name}
                          </Link>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/events/${event._id}`}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            View
                          </Link>
                          {event.creator._id === userInfo._id && (
                            <>
                              <Link
                                to={`/event-manager/edit/${event._id}`}
                                className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs"
                              >
                                Edit
                              </Link>
                              <Link
                                to={`/event-manager/attendees/${event._id}`}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs"
                              >
                                Attendees
                              </Link>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Message variant="info">
              {activeTab === "myEvents"
                ? "You haven't created any events yet."
                : activeTab === "upcoming"
                  ? "No upcoming events found."
                  : "No past events found."}
            </Message>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventManagerPage

