"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPosts, createPost } from "../slices/postSlice"
import { getCommunities } from "../slices/communitySlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import PostCard from "../components/PostCard"

const DiscussionsPage = () => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [community, setCommunity] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [filter, setFilter] = useState("all")

  const { loading, error, posts, success } = useSelector((state) => state.posts)
  const { communities } = useSelector((state) => state.communities)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getPosts())
    dispatch(getCommunities())
  }, [dispatch])

  useEffect(() => {
    if (success) {
      setTitle("")
      setContent("")
      setCommunity("")
      setShowCreateForm(false)
    }
  }, [success])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(
      createPost({
        title,
        content,
        community: community || undefined,
      }),
    )
  }

  // Filter posts based on selected filter
  const filteredPosts = posts?.filter((post) => {
    if (filter === "all") return true
    if (filter === "mine" && userInfo) return post.author._id === userInfo._id
    if (filter === "announcements") return post.isAnnouncement
    if (filter === "community" && community) return post.community?._id === community
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600 mb-4 md:mb-0">Discussions</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          {showCreateForm ? "Cancel" : "Start a Discussion"}
        </button>
      </div>

      {/* Create Post Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create a New Discussion</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-1">
                Community (Optional)
              </label>
              <select
                id="community"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">None (Post to general discussions)</option>
                {communities?.map((comm) => (
                  <option key={comm._id} value={comm._id}>
                    {comm.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Post Discussion
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter By
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Discussions</option>
              <option value="mine">My Discussions</option>
              <option value="announcements">Announcements</option>
              <option value="community">By Community</option>
            </select>
          </div>

          {filter === "community" && (
            <div>
              <label htmlFor="communityFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Select Community
              </label>
              <select
                id="communityFilter"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select a community</option>
                {communities?.map((comm) => (
                  <option key={comm._id} value={comm._id}>
                    {comm.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : filteredPosts && filteredPosts.length > 0 ? (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <Message variant="info">No discussions found. Be the first to start a discussion!</Message>
      )}
    </div>
  )
}

export default DiscussionsPage

