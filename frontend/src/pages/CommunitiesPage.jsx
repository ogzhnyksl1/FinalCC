"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getCommunities, joinCommunity, leaveCommunity } from "../slices/communitySlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import CommunityCard from "../components/CommunityCard"

const CommunitiesPage = () => {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState("")
  const [showJoinedOnly, setShowJoinedOnly] = useState(false)

  const { loading, error, communities, success, message } = useSelector((state) => state.communities)
  const { userInfo, userProfile } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getCommunities())
  }, [dispatch])

  // Filter communities based on search term and joined filter
  const filteredCommunities = communities?.filter((community) => {
    // Filter by search term
    if (searchTerm && !community.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Filter by joined communities
    if (showJoinedOnly && userProfile) {
      return userProfile.communities.some((userCommunity) => userCommunity._id === community._id)
    }

    return true
  })

  const handleJoinCommunity = (communityId) => {
    dispatch(joinCommunity(communityId))
  }

  const handleLeaveCommunity = (communityId) => {
    dispatch(leaveCommunity(communityId))
  }

  const isUserInCommunity = (communityId) => {
    return userProfile?.communities.some((userCommunity) => userCommunity._id === communityId)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600 mb-4 md:mb-0">Communities</h1>
        {userInfo && (userInfo.role === "communityManager" || userInfo.role === "admin") && (
          <Link
            to="/community-manager/create"
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Create Community
          </Link>
        )}
      </div>

      {success && message && <Message variant="success">{message}</Message>}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Communities
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {userProfile && (
            <div className="flex items-end">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showJoinedOnly}
                  onChange={() => setShowJoinedOnly(!showJoinedOnly)}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span className="ml-2 text-gray-700">Show only communities I've joined</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Communities List */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : filteredCommunities && filteredCommunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <CommunityCard
              key={community._id}
              community={community}
              isJoined={isUserInCommunity(community._id)}
              onJoin={() => handleJoinCommunity(community._id)}
              onLeave={() => handleLeaveCommunity(community._id)}
            />
          ))}
        </div>
      ) : (
        <Message variant="info">No communities found. {searchTerm ? "Try adjusting your search." : ""}</Message>
      )}
    </div>
  )
}

export default CommunitiesPage

