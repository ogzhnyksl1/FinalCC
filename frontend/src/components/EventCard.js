import { Link } from "react-router-dom"
import { formatDate } from "../utils/formatDate"
import "../styles/components/EventCard.css"

const EventCard = ({ event }) => {
  // Remove unused variable
  const isPastEvent = new Date(event.date) < new Date()

  // Check if event is today
  const isToday = () => {
    const today = new Date()
    const eventDate = new Date(event.date)
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    )
  }

  const getEventStatus = () => {
    if (isPastEvent) return "Past"
    if (isToday()) return "Today"
    return "Upcoming"
  }

  const getStatusClass = () => {
    if (isPastEvent) return "event-status-past"
    if (isToday()) return "event-status-today"
    return "event-status-upcoming"
  }

  return (
    <div className="event-card">
      {event.image ? (
        <img src={event.image || "/placeholder.svg"} alt={event.title} className="event-image" />
      ) : (
        <div className="event-image-placeholder">
          <span>No Image</span>
        </div>
      )}
      <div className="event-body">
        <div className="event-header">
          <h3 className="event-title">{event.title}</h3>
          <span className={`event-status ${getStatusClass()}`}>{getEventStatus()}</span>
        </div>

        <div className="event-details">
          <div className="event-detail">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="event-detail-icon"
              width="16"
              height="16"
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
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="event-detail">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="event-detail-icon"
              width="16"
              height="16"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
          {event.community && (
            <div className="event-detail">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="event-detail-icon"
                width="16"
                height="16"
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
              <span>{event.community.name}</span>
            </div>
          )}
        </div>

        <div className="event-footer">
          <span className="event-attendees">
            {event.attendees?.length || 0} attendee(s)
            {event.maxAttendees > 0 && ` / ${event.maxAttendees}`}
          </span>
          <Link to={`/events/${event._id}`} className="event-link">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventCard

