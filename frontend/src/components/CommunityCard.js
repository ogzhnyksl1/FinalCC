"use client"

import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

const CommunityCard = ({ community, isJoined, onJoin, onLeave }) => {
  const { userInfo } = useSelector((state) => state.auth)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {community.image ? (
        <img src={community.image || "/placeholder.svg"} alt={community.name} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-lg">👥</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            <Link to={`/communities/${community._id}`} className="hover:text-green-600">
              {community.name}
            </Link>
          </h3>
          {community.isPrivate && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Private</span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{community.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{community.members?.length || 0} members</span>
          {userInfo ? (
            isJoined ? (
              <button
                onClick={onLeave}
                className="text-sm bg-gray-200 text-gray-800 py-1 px-3 rounded-md hover:bg-gray-300 transition-colors"
              >
                Leave
              </button>
            ) : (
              <button
                onClick={onJoin}
                className="text-sm bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors"
              >
                Join
              </button>
            )
          ) : (
            <Link
              to="/login"
              className="text-sm bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors"
            >
              Log in to Join
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommunityCard

