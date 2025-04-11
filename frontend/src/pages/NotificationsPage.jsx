"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getNotifications, markAsRead, markAllAsRead } from "../slices/notificationSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import { formatDate } from "../utils/formatDate"

const NotificationsPage = () => {
  const dispatch = useDispatch()

  const { loading, error, notifications } = useSelector((state) => state.notifications)

  useEffect(() => {
    dispatch(getNotifications())
  }, [dispatch])

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
  }

  const unreadCount = notifications?.filter((notification) => !notification.read).length || 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">Notifications</h1>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="text-green-600 hover:text-green-700 font-medium">
              Mark All as Read
            </button>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="error">{error}</Message>
        ) : notifications && notifications.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`p-4 hover:bg-gray-50 ${!notification.read ? "bg-green-50" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        to={notification.link}
                        className="block mb-1"
                        onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                      >
                        <p className="text-gray-800">{notification.message}</p>
                      </Link>
                      <p className="text-xs text-gray-500">{formatDate(notification.createdAt)}</p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-sm text-green-600 hover:text-green-700"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Message variant="info">You have no notifications.</Message>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage

