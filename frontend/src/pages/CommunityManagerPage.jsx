"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getCommunities, createCommunity } from "../slices/communitySlice"
import Loader from "../components/Loader"
import Message from "../components/Message"

const CommunityManagerPage = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState("myCommunities")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)

  const { loading, error, communities, success } = useSelector((state) => state.communities)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getCommunities())
  }, [dispatch])

  useEffect(() => {
    if (success) {
      setShowCreateForm(false)
      setName("")
      setDescription("")
      setImage("")
      setIsPrivate(false)
    }
  }, [success])

  const handleCreateCommunity = (e) => {
    e.preventDefault()
    dispatch(
      createCommunity({
        name,
        description,
        image,
        isPrivate,
      }),
    )
  }

  // Filter communities based on active tab
  const filteredCommunities = communities?.filter((community) => {
    if (activeTab === "myCommunities") {
      return community.managers.some((manager) => manager._id === userInfo._id)
    }
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600 mb-4 md:mb-0">Community Manager Dashboard</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          {showCreateForm ? "Cancel" : "Create Community"}
        </button>
      </div>

      {/* Create Community Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create a New Community</h2>
          <form onSubmit={handleCreateCommunity}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Community Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Optional)
              </label>
              <input
                type="text"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span className="ml-2 text-gray-700">Private Community</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Private communities require approval to join and are not visible in public listings.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Create Community
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Community Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-3 px-4 font-medium ${
              activeTab === "myCommunities"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("myCommunities")}
          >
            My Communities
          </button>
          <button
            className={`py-3 px-4 font-medium ${
              activeTab === "allCommunities"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("allCommunities")}
          >
            All Communities
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">{error}</Message>
          ) : filteredCommunities && filteredCommunities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Members</th>
                    <th className="py-3 px-6 text-left">Groups</th>
                    <th className="py-3 px-6 text-left">Privacy</th>
                    <th className="py-3 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {filteredCommunities.map((community) => (
                    <tr key={community._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <div className="mr-2">
                            {community.image ? (
                              <img
                                src={community.image || "/placeholder.svg"}
                                alt={community.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">👥</span>
                              </div>
                            )}
                          </div>
                          <Link to={`/communities/${community._id}`} className="hover:text-green-600">
                            {community.name}
                          </Link>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">{community.members?.length || 0}</td>
                      <td className="py-3 px-6 text-left">{community.groups?.length || 0}</td>
                      <td className="py-3 px-6 text-left">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            community.isPrivate ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {community.isPrivate ? "Private" : "Public"}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/communities/${community._id}`}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            View
                          </Link>
                          {community.managers.some((manager) => manager._id === userInfo._id) && (
                            <>
                              <Link
                                to={`/community-manager/edit/${community._id}`}
                                className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs"
                              >
                                Edit
                              </Link>
                              <Link
                                to={`/community-manager/managers/${community._id}`}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs"
                              >
                                Managers
                              </Link>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Message variant="info">
              {activeTab === "myCommunities"
                ? "You don't manage any communities yet. Create one to get started!"
                : "No communities found."}
            </Message>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommunityManagerPage

