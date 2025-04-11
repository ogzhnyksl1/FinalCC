"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getEvents } from "../slices/eventSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import EventCard from "../components/EventCard"

const EventsPage = () => {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("all")

  const { loading, error, events } = useSelector((state) => state.events)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getEvents())
  }, [dispatch])

  // Extract unique categories from events
  const categories = events ? [...new Set(events.map((event) => event.community?.name).filter(Boolean))] : []

  // Filter events based on search term, category, and date
  const filteredEvents = events?.filter((event) => {
    // Filter by search term
    if (
      searchTerm &&
      !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !event.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Filter by category (community)
    if (categoryFilter && event.community?.name !== categoryFilter) {
      return false
    }

    // Filter by date
    const eventDate = new Date(event.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (dateFilter === "upcoming" && eventDate < today) {
      return false
    } else if (dateFilter === "past" && eventDate >= today) {
      return false
    } else if (dateFilter === "today") {
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return eventDate >= today && eventDate < tomorrow
    }

    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600 mb-4 md:mb-0">Events</h1>
        {userInfo && (userInfo.role === "eventManager" || userInfo.role === "admin") && (
          <Link
            to="/event-manager/create"
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Create Event
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Events
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Community
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Communities</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Date
            </label>
            <select
              id="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="today">Today</option>
              <option value="past">Past Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : filteredEvents && filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <Message variant="info">
          No events found. {searchTerm || categoryFilter || dateFilter !== "all" ? "Try adjusting your filters." : ""}
        </Message>
      )}
    </div>
  )
}

export default EventsPage

