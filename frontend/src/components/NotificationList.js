"use client"

import { formatDate } from "../utils/formatDate"

const NotificationList = ({ notifications, onNotificationClick }) => {
  if (!notifications || notifications.length === 0) {
    return <div className="p-4 text-center text-gray-500">No notifications</div>
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="p-2 bg-gray-100 border-b border-gray-200">
        <h3 className="font-medium text-gray-700">Notifications</h3>
      </div>
      <ul>
        {notifications.map((notification) => (
          <li
            key={notification._id}
            className={`p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
              !notification.read ? "bg-green-50" : ""
            }`}
            onClick={() => onNotificationClick(notification)}
          >
            <div className="flex items-start">
              <div className="flex-grow">
                <p className="text-sm text-gray-800">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(notification.createdAt)}</p>
              </div>
              {!notification.read && <span className="h-2 w-2 bg-green-600 rounded-full mt-1"></span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NotificationList

