"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getCommunityById, joinCommunity, leaveCommunity, deleteCommunity } from "../slices/communitySlice"
import { getPosts, createPost } from "../slices/postSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import PostCard from "../components/PostCard"
import CommunityAnalytics from "../components/CommunityAnalytics"

const CommunityDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showCreatePost, setShowCreatePost] = useState(false)
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")
  const [isAnnouncement, setIsAnnouncement] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")

  const { loading, error, community, success, message } = useSelector((state) => state.communities)
  const { posts, loading: postsLoading, error: postsError } = useSelector((state) => state.posts)
  const { userInfo, userProfile } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getCommunityById(id))
    dispatch(getPosts({ community: id }))
  }, [dispatch, id])

  useEffect(() => {
    if (success && message === "Community deleted successfully") {
      navigate("/communities")
    }
  }, [success, message, navigate])

  const handleJoinCommunity = () => {
    dispatch(joinCommunity(id))
  }

  const handleLeaveCommunity = () => {
    dispatch(leaveCommunity(id))
  }

  const handleDeleteCommunity = () => {
    dispatch(deleteCommunity(id))
  }

  const handleCreatePost = (e) => {
    e.preventDefault()
    dispatch(
      createPost({
        title: postTitle,
        content: postContent,
        community: id,
        isAnnouncement,
      }),
    )
    setPostTitle("")
    setPostContent("")
    setIsAnnouncement(false)
    setShowCreatePost(false)
  }

  const isUserInCommunity = () => {
    return userProfile?.communities.some((userCommunity) => userCommunity._id === id)
  }

  const isUserManager = () => {
    return community?.managers.some((manager) => manager._id === userInfo?._id)
  }

  const isAdmin = userInfo?.role === "admin"
  const canManage = isUserManager() || isAdmin

  // Filter community posts
  const communityPosts = posts?.filter((post) => post.community?._id === id)
  const announcements = communityPosts?.filter((post) => post.isAnnouncement)
  const regularPosts = communityPosts?.filter((post) => !post.isAnnouncement)

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : community ? (
        <div>
          {success && message && <Message variant="success">{message}</Message>}

          {/* Community Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {community.image ? (
              <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${community.image})` }}>
                <div className="h-full w-full bg-black bg-opacity-30 flex items-end p-6">
                  <h1 className="text-3xl font-bold text-white">{community.name}</h1>
                </div>
              </div>
            ) : (
              <div className="h-48 w-full bg-gradient-to-r from-green-600 to-green-800 flex items-end p-6">
                <h1 className="text-3xl font-bold text-white">{community.name}</h1>
              </div>
            )}

            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-gray-600 mr-4">
                      {community.members?.length || 0} {community.members?.length === 1 ? "member" : "members"}
                    </span>
                    <span className="text-gray-600">
                      {community.groups?.length || 0} {community.groups?.length === 1 ? "group" : "groups"}
                    </span>
                  </div>
                  {community.isPrivate && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Private</span>
                  )}
                </div>

                <div className="mt-4 md:mt-0">
                  {userInfo ? (
                    isUserInCommunity() ? (
                      <button
                        onClick={handleLeaveCommunity}
                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Leave Community
                      </button>
                    ) : (
                      <button
                        onClick={handleJoinCommunity}
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Join Community
                      </button>
                    )
                  ) : (
                    <Link
                      to="/login"
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Log in to Join
                    </Link>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-4">{community.description}</p>

              {canManage && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to={`/community-manager/edit/${community._id}`}
                    className="bg-green-600 text-white py-1 px-3 rounded-md text-sm hover:bg-green-700 transition-colors"
                  >
                    Edit Community
                  </Link>
                  <Link
                    to={`/community-manager/groups/create?community=${community._id}`}
                    className="bg-green-600 text-white py-1 px-3 rounded-md text-sm hover:bg-green-700 transition-colors"
                  >
                    Create Group
                  </Link>
                  <Link
                    to={`/community-manager/managers/${community._id}`}
                    className="bg-green-600 text-white py-1 px-3 rounded-md text-sm hover:bg-green-700 transition-colors"
                  >
                    Manage Members
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 text-white py-1 px-3 rounded-md text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete Community
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Community Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`py-3 px-4 font-medium ${
                  activeTab === "posts"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("posts")}
              >
                Posts
              </button>
              <button
                className={`py-3 px-4 font-medium ${
                  activeTab === "announcements"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("announcements")}
              >
                Announcements
              </button>
              <button
                className={`py-3 px-4 font-medium ${
                  activeTab === "groups"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("groups")}
              >
                Groups
              </button>
              {canManage && (
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
              )}
            </div>

            <div className="p-6">
              {/* Posts Tab */}
              {activeTab === "posts" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Community Posts</h2>
                    {isUserInCommunity() && (
                      <button
                        onClick={() => setShowCreatePost(!showCreatePost)}
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                      >
                        {showCreatePost ? "Cancel" : "Create Post"}
                      </button>
                    )}
                  </div>

                  {/* Create Post Form */}
                  {showCreatePost && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <form onSubmit={handleCreatePost}>
                        <div className="mb-4">
                          <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            id="postTitle"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                          </label>
                          <textarea
                            id="postContent"
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          ></textarea>
                        </div>

                        {(isUserManager() || isAdmin) && (
                          <div className="mb-4">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={isAnnouncement}
                                onChange={() => setIsAnnouncement(!isAnnouncement)}
                                className="form-checkbox h-5 w-5 text-green-600"
                              />
                              <span className="ml-2 text-gray-700">Post as announcement</span>
                            </label>
                          </div>
                        )}

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                          >
                            Post
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Posts List */}
                  {postsLoading ? (
                    <Loader />
                  ) : postsError ? (
                    <Message variant="error">{postsError}</Message>
                  ) : regularPosts && regularPosts.length > 0 ? (
                    <div className="space-y-6">
                      {regularPosts.map((post) => (
                        <PostCard key={post._id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <Message variant="info">No posts in this community yet. Be the first to post!</Message>
                  )}
                </div>
              )}

              {/* Announcements Tab */}
              {activeTab === "announcements" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Community Announcements</h2>

                  {postsLoading ? (
                    <Loader />
                  ) : postsError ? (
                    <Message variant="error">{postsError}</Message>
                  ) : announcements && announcements.length > 0 ? (
                    <div className="space-y-6">
                      {announcements.map((post) => (
                        <PostCard key={post._id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <Message variant="info">No announcements in this community yet.</Message>
                  )}
                </div>
              )}

              {/* Groups Tab */}
              {activeTab === "groups" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Community Groups</h2>
                    {canManage && (
                      <Link
                        to={`/community-manager/groups/create?community=${community._id}`}
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Create Group
                      </Link>
                    )}
                  </div>

                  {community.groups && community.groups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {community.groups.map((group) => (
                        <div key={group._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h3 className="font-medium mb-2">
                            <Link to={`/groups/${group._id}`} className="hover:text-green-600">
                              {group.name}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{group.description}</p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">{group.members?.length || 0} members</span>
                            <Link to={`/groups/${group._id}`} className="text-green-600 hover:underline">
                              View Group
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Message variant="info">No groups in this community yet.</Message>
                  )}
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && canManage && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Community Analytics</h2>
                  <CommunityAnalytics communityId={community._id} />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Message variant="error">Community not found</Message>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Delete Community</h2>
            <p className="mb-6">
              Are you sure you want to delete this community? This action cannot be undone and will remove all posts and
              groups within the community.
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCommunity}
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

export default CommunityDetailsPage

