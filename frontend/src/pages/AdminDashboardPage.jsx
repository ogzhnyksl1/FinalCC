"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getAdminStats } from "../slices/adminSlice"
import { getUsers, updateUser, deleteUser, resetUserPassword } from "../slices/adminSlice"
import { getPlatformOverview, getUserAnalytics } from "../slices/analyticsSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import { formatDate } from "../utils/formatDate"
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

const AdminDashboardPage = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedUser, setSelectedUser] = useState(null)
  const [newPassword, setNewPassword] = useState("")
  const [newRole, setNewRole] = useState("")
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const { loading: statsLoading, error: statsError, stats } = useSelector((state) => state.admin)
  const { loading: usersLoading, error: usersError, users, success } = useSelector((state) => state.admin)
  const {
    platformOverview,
    userAnalytics,
    loading: analyticsLoading,
    error: analyticsError,
  } = useSelector((state) => state.analytics)

  useEffect(() => {
    dispatch(getAdminStats())
    dispatch(getUsers())
    dispatch(getPlatformOverview())
    dispatch(getUserAnalytics())
  }, [dispatch])

  useEffect(() => {
    if (success) {
      setShowResetPasswordModal(false)
      setShowEditUserModal(false)
      setShowDeleteUserModal(false)
      setSelectedUser(null)
      setNewPassword("")
      setNewRole("")
    }
  }, [success])

  const handleResetPassword = (e) => {
    e.preventDefault()
    if (selectedUser && newPassword) {
      dispatch(resetUserPassword({ id: selectedUser._id, password: newPassword }))
    }
  }

  const handleUpdateUser = (e) => {
    e.preventDefault()
    if (selectedUser && newRole) {
      dispatch(updateUser({ id: selectedUser._id, role: newRole }))
    }
  }

  const handleDeleteUser = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser._id))
    }
  }

  // Filter users based on search term
  const filteredUsers = users?.filter((user) => {
    if (searchTerm) {
      return (
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return true
  })

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
      <h1 className="text-3xl font-bold mb-6 text-green-600">Admin Dashboard</h1>

      {/* Admin Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-3 px-4 font-medium ${
              activeTab === "overview"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`py-3 px-4 font-medium ${
              activeTab === "users" ? "border-b-2 border-green-600 text-green-600" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("users")}
          >
            User Management
          </button>
          <button
            className={`py-3 px-4 font-medium ${
              activeTab === "analytics"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
          <button
            className={`py-3 px-4 font-medium ${
              activeTab === "reports"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("reports")}
          >
            Reports
          </button>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Platform Overview</h2>

              {statsLoading || analyticsLoading ? (
                <Loader />
              ) : statsError || analyticsError ? (
                <Message variant="error">{statsError || analyticsError}</Message>
              ) : stats && platformOverview ? (
                <div>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Total Users</h3>
                      <p className="text-3xl font-bold text-gray-800">{platformOverview.userCount}</p>
                      <p className="text-sm text-green-600 mt-1">
                        {platformOverview.activeUserPercentage}% active in last 30 days
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Communities</h3>
                      <p className="text-3xl font-bold text-gray-800">{platformOverview.communityCount}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Events</h3>
                      <p className="text-3xl font-bold text-gray-800">{platformOverview.eventCount}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Posts</h3>
                      <p className="text-3xl font-bold text-gray-800">{platformOverview.postCount}</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Users */}
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <h3 className="font-medium mb-3">Recent Users</h3>
                      <div className="space-y-3">
                        {stats.recentUsers?.map((user) => (
                          <div key={user._id} className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                              {user.profilePicture ? (
                                <img
                                  src={user.profilePicture || "/placeholder.svg"}
                                  alt={user.name}
                                  className="h-10 w-10 object-cover"
                                />
                              ) : (
                                <span className="text-gray-500">👤</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <Link to="/admin/users" className="text-green-600 hover:underline text-sm">
                          View All Users
                        </Link>
                      </div>
                    </div>

                    {/* Recent Posts */}
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <h3 className="font-medium mb-3">Recent Posts</h3>
                      <div className="space-y-3">
                        {stats.recentPosts?.map((post) => (
                          <div key={post._id} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                            <Link to={`/posts/${post._id}`} className="font-medium hover:text-green-600">
                              {post.title}
                            </Link>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <span>{post.author.name}</span>
                              <span className="mx-1">•</span>
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <Link to="/discussions" className="text-green-600 hover:underline text-sm">
                          View All Posts
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      to="/admin/settings"
                      className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <h3 className="font-medium mb-1">Platform Settings</h3>
                      <p className="text-sm opacity-80">Configure platform settings and preferences</p>
                    </Link>
                    <Link
                      to="/admin/reports"
                      className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <h3 className="font-medium mb-1">Manage Reports</h3>
                      <p className="text-sm opacity-80">Review and handle user reports</p>
                    </Link>
                    <Link
                      to="/admin/feedback"
                      className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <h3 className="font-medium mb-1">User Feedback</h3>
                      <p className="text-sm opacity-80">View and respond to user feedback</p>
                    </Link>
                  </div>
                </div>
              ) : (
                <Message variant="info">No data available.</Message>
              )}
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === "users" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">User Management</h2>
                <div className="w-64">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {usersLoading ? (
                <Loader />
              ) : usersError ? (
                <Message variant="error">{usersError}</Message>
              ) : filteredUsers && filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Name</th>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-left">Role</th>
                        <th className="py-3 px-6 text-left">Joined</th>
                        <th className="py-3 px-6 text-left">Status</th>
                        <th className="py-3 px-6 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-6 text-left">
                            <div className="flex items-center">
                              <div className="mr-2">
                                {user.profilePicture ? (
                                  <img
                                    src={user.profilePicture || "/placeholder.svg"}
                                    alt={user.name}
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">👤</span>
                                  </div>
                                )}
                              </div>
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-6 text-left">{user.email}</td>
                          <td className="py-3 px-6 text-left">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                user.role === "admin"
                                  ? "bg-red-100 text-red-800"
                                  : user.role === "communityManager" || user.role === "eventManager"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-left">{formatDate(user.createdAt)}</td>
                          <td className="py-3 px-6 text-left">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-left">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user)
                                  setNewRole(user.role)
                                  setShowEditUserModal(true)
                                }}
                                className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUser(user)
                                  setShowResetPasswordModal(true)
                                }}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs"
                              >
                                Reset Password
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUser(user)
                                  setShowDeleteUserModal(true)
                                }}
                                className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Message variant="info">No users found.</Message>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Platform Analytics</h2>

              {analyticsLoading ? (
                <Loader />
              ) : analyticsError ? (
                <Message variant="error">{analyticsError}</Message>
              ) : userAnalytics ? (
                <div className="space-y-8">
                  {/* User Growth Chart */}
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <h3 className="font-medium mb-3">User Growth</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={formatUserGrowthData(userAnalytics.newUsersPerMonth)}
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

                  {/* User Roles Distribution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <h3 className="font-medium mb-3">User Roles Distribution</h3>
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

                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <h3 className="font-medium mb-3">Active Users</h3>
                      <div className="flex flex-col items-center justify-center h-64">
                        <div className="text-6xl font-bold text-green-600">{userAnalytics.activeUserPercentage}%</div>
                        <p className="text-gray-500 mt-2">of users active in the last 30 days</p>
                        <div className="mt-4 text-center">
                          <div className="text-xl font-semibold">{userAnalytics.activeUsers}</div>
                          <p className="text-gray-500">active users</p>
                        </div>
                        <div className="mt-2 text-center">
                          <div className="text-xl font-semibold">{userAnalytics.totalUsers}</div>
                          <p className="text-gray-500">total users</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Message variant="info">No analytics data available.</Message>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Reports Management</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <Link
                  to="/admin/reports"
                  className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex-1 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium mb-2">Content Reports</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Review and manage reports about users, posts, and comments.
                  </p>
                  <span className="text-green-600 hover:underline text-sm">View Reports →</span>
                </Link>
                <Link
                  to="/admin/feedback"
                  className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex-1 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium mb-2">User Feedback</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Review and respond to feedback, bug reports, and feature requests.
                  </p>
                  <span className="text-green-600 hover:underline text-sm">View Feedback →</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Reset Password for {selectedUser.name}</h2>
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  minLength="6"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowResetPasswordModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Edit User: {selectedUser.name}</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="user">User</option>
                  <option value="communityManager">Community Manager</option>
                  <option value="eventManager">Event Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Delete User</h2>
            <p className="mb-6">
              Are you sure you want to delete the user <strong>{selectedUser.name}</strong>? This action cannot be
              undone and will remove all content created by this user.
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteUserModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboardPage

