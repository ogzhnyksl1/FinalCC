"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getCommunityAnalytics } from "../slices/analyticsSlice"
import Loader from "./Loader"
import Message from "./Message"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const CommunityAnalytics = ({ communityId }) => {
  const dispatch = useDispatch()

  const { loading, error, communityAnalytics } = useSelector((state) => state.analytics)

  useEffect(() => {
    if (communityId) {
      dispatch(getCommunityAnalytics(communityId))
    }
  }, [dispatch, communityId])

  // Format data for charts
  const formatPostActivityData = (data) => {
    if (!data) return []

    return Object.entries(data).map(([month, count]) => ({
      month,
      posts: count,
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Community Analytics</h2>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : communityAnalytics ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Members</h3>
              <p className="text-2xl font-bold text-gray-800">{communityAnalytics.memberCount}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Posts</h3>
              <p className="text-2xl font-bold text-gray-800">{communityAnalytics.postCount}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Groups</h3>
              <p className="text-2xl font-bold text-gray-800">{communityAnalytics.groupCount}</p>
            </div>
          </div>

          {/* Post Activity Chart */}
          <div>
            <h3 className="text-lg font-medium mb-3">Post Activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formatPostActivityData(communityAnalytics.postActivity)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="posts" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Members */}
          <div>
            <h3 className="text-lg font-medium mb-3">Top Contributors</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posts
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {communityAnalytics.topMembers.map((member) => (
                    <tr key={member._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {member.profilePicture ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={member.profilePicture || "/placeholder.svg"}
                                alt={member.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">👤</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.postCount}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <Message variant="info">No analytics data available.</Message>
      )}
    </div>
  )
}

export default CommunityAnalytics

