"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getEventAnalytics } from "../slices/analyticsSlice"
import Loader from "./Loader"
import Message from "./Message"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const EventAnalytics = ({ eventId }) => {
  const dispatch = useDispatch()

  const { loading, error, eventAnalytics } = useSelector((state) => state.analytics)

  useEffect(() => {
    if (eventId) {
      dispatch(getEventAnalytics(eventId))
    }
  }, [dispatch, eventId])

  // Format data for charts
  const formatRegistrationTimelineData = (data) => {
    if (!data) return []

    return Object.entries(data).map(([date, count]) => ({
      date,
      registrations: count,
    }))
  }

  const COLORS = ["#16a34a", "#d1d5db"]

  const registrationData = [
    { name: "Registered", value: eventAnalytics?.attendeeCount || 0 },
    {
      name: "Available",
      value:
        eventAnalytics?.maxAttendees > 0 ? Math.max(0, eventAnalytics.maxAttendees - eventAnalytics.attendeeCount) : 0,
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Event Analytics</h2>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : eventAnalytics ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Attendees</h3>
              <p className="text-2xl font-bold text-gray-800">
                {eventAnalytics.attendeeCount}
                {eventAnalytics.maxAttendees > 0 && ` / ${eventAnalytics.maxAttendees}`}
              </p>
              {eventAnalytics.maxAttendees > 0 && (
                <p className="text-sm text-green-600 mt-1">{eventAnalytics.registrationRate}% capacity</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Announcements</h3>
              <p className="text-2xl font-bold text-gray-800">{eventAnalytics.announcementCount}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Days Until Event</h3>
              <p className="text-2xl font-bold text-gray-800">
                {eventAnalytics.daysUntilEvent > 0 ? eventAnalytics.daysUntilEvent : "Event has passed"}
              </p>
            </div>
          </div>

          {/* Registration Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Registration Capacity */}
            {eventAnalytics.maxAttendees > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Registration Capacity</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={registrationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {registrationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Registration Timeline */}
            <div>
              <h3 className="text-lg font-medium mb-3">Registration Timeline</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={formatRegistrationTimelineData(eventAnalytics.registrationTimeline)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="registrations" stroke="#16a34a" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Message variant="info">No analytics data available.</Message>
      )}
    </div>
  )
}

export default EventAnalytics

