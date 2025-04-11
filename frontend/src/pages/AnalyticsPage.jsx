"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPlatformOverview, getUserAnalytics } from "../slices/analyticsSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const AnalyticsPage = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState("overview")

  const { loading, error, platformOverview, userAnalytics } = useSelector((state) => state.analytics)

  useEffect(() => {
    if (activeTab === "overview") {
      dispatch(getPlatformOverview())
    } else if (activeTab === "users") {
      dispatch(getUserAnalytics())
    }
  }, [dispatch, activeTab])

  // Format data for charts
  const formatUserGrowthData = (data) => {
    if (!data) return []

    return data.map((item) => ({
      month: `${item._id.month}/${item._id.year}`,
      users: item.count,
    }))
  }

  const formatUserRolesData = (data) => {
    if (!data) return []

    return data.map((item) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
    }))
  }

  const COLORS = ["#16a34a", "#2563eb", "#d97706", "#dc2626"]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Analytics Dashboard</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "overview"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Platform Overview
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "users" ? "border-b-2 border-green-600 text-green-600" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("users")}
        >
          User Analytics
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <>
          {activeTab === "overview" && platformOverview && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Users</h3>
                  <p className="text-3xl font-bold text-gray-800">{platformOverview.userCount}</p>
                  <p className="text-sm text-green-600 mt-1">{platformOverview.activeUserPercentage}% active</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Communities</h3>
                  <p className="text-3xl font-bold text-gray-800">{platformOverview.communityCount}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Events</h3>
                  <p className="text-3xl font-bold text-gray-800">{platformOverview.eventCount}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Posts</h3>
                  <p className="text-3xl font-bold text-gray-800">{platformOverview.postCount}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Jobs</h3>
                  <p className="text-3xl font-bold text-gray-800">{platformOverview.jobCount}</p>
                </div>
              </div>

              {/* User Growth Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">User Growth</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={formatUserGrowthData(platformOverview.userGrowth)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="#16a34a" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && userAnalytics && (
            <div className="space-y-8">
              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Users</h3>
                  <p className="text-3xl font-bold text-gray-800">{userAnalytics.totalUsers}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Active Users (30 days)</h3>
                  <p className="text-3xl font-bold text-gray-800">{userAnalytics.activeUsers}</p>
                  <p className="text-sm text-green-600 mt-1">{userAnalytics.activeUserPercentage}% of total</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">New Users (30 days)</h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {userAnalytics.newUsersPerMonth.reduce((sum, item) => sum + item.count, 0)}
                  </p>
                </div>
              </div>

              {/* User Roles Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">User Roles Distribution</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={formatUserRolesData(userAnalytics.userRoles)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {formatUserRolesData(userAnalytics.userRoles).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* New Users Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">New Users per Month</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={formatUserGrowthData(userAnalytics.newUsersPerMonth)}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" fill="#16a34a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AnalyticsPage

