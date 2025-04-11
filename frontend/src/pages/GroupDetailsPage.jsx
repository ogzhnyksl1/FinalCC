"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getGroupById, joinGroup, leaveGroup, deleteGroup } from "../slices/communitySlice"
import { getPosts, createPost } from "../slices/postSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import PostCard from "../components/PostCard"

const GroupDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showCreatePost, setShowCreatePost] = useState(false)
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")
  const [isAnnouncement, setIsAnnouncement] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { loading, error, group, success, message } = useSelector((state) => state.communities)
  const { posts, loading: postsLoading, error: postsError } = useSelector((state) => state.posts)
  const { userInfo, userProfile } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getGroupById(id))
    dispatch(getPosts({ group: id }))
  }, [dispatch, id])

  useEffect(() => {
    if (success && message === "Group deleted successfully") {
      navigate(`/communities/${group?.community?._id}`)
    }
  }, [success, message, navigate, group])

  const handleJoinGroup = () => {
    dispatch(joinGroup(id))
  }

  const handleLeaveGroup = () => {
    dispatch(leaveGroup(id))
  }

  const handleDeleteGroup = () => {
    dispatch(deleteGroup(id))
  }

  const handleCreatePost = (e) => {
    e.preventDefault()
    dispatch(
      createPost({
        title: postTitle,
        content: postContent,
        group: id,
        isAnnouncement,
      }),
    )
    setPostTitle("")
    setPostContent("")
    setIsAnnouncement(false)
    setShowCreatePost(false)
  }

  const isUserInGroup = () => {
    return group?.members.some((member) => member._id === userInfo?._id)
  }

  const isUserManager = () => {
    return group?.managers.some((manager) => manager._id === userInfo?._id)
  }

  const isUserCommunityManager = () => {
    return group?.community?.managers.some((manager) => manager._id === userInfo?._id)
  }

  const isAdmin = userInfo?.role === "admin"
  const canManage = isUserManager() || isUserCommunityManager() || isAdmin

  // Filter group posts
  const groupPosts = posts?.filter((post) => post.group?._id === id)
  const announcements = groupPosts?.filter((post) => post.isAnnouncement)
  const regularPosts = groupPosts?.filter((post) => !post.isAnnouncement)

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : group ? (
        <div>
          {success && message && <Message variant="success">{message}</Message>}

          {/* Group Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {group.image ? (
              <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${group.image})` }}>
                <div className="h-full w-full bg-black bg-opacity-30 flex items-end p-6">
                  <h1 className="text-3xl font-bold text-white">{group.name}</h1>
                </div>
              </div>
            ) : (
              <div className="h-48 w-full bg-gradient-to-r from-green-600 to-green-800 flex items-end p-6">
                <h1 className="text-3xl font-bold text-white">{group.name}</h1>
              </div>
            )}

            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-gray-600 mr-4">
                      {group.members?.length || 0} {group.members?.length === 1 ? "member" : "members"}
                    </span>
                    <span className="flex items-center text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <Link to={`/communities/${group.community?._id}`} className="hover:text-green-600">
                        {group.community?.name}
                      </Link>
                    </span>
                  </div>
                  {group.isPrivate && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Private</span>
                  )}
                </div>

                <div className="mt-4 md:mt-0">
                  {userInfo ? (
                    isUserInGroup() ? (
                      <button
                        onClick={handleLeaveGroup}
                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Leave Group
                      </button>
                    ) : (
                      <button
                        onClick={handleJoinGroup}
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Join Group
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

              <p className="text-gray-700 mb-4">{group.description}</p>

              {canManage && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to={`/community-manager/groups/edit/${group._id}`}
                    className="bg-green-600 text-white py-1 px-3 rounded-md text-sm hover:bg-green-700 transition-colors"
                  >
                    Edit Group
                  </Link>
                  <Link
                    to={`/community-manager/groups/managers/${group._id}`}
                    className="bg-green-600 text-white py-1 px-3 rounded-md text-sm hover:bg-green-700 transition-colors"
                  >
                    Manage Members
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 text-white py-1 px-3 rounded-md text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete Group
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Group Content */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button className="py-3 px-4 font-medium border-b-2 border-green-600 text-green-600">Posts</button>
            </div>

            <div className="p-6">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Group Posts</h2>
                  {isUserInGroup() && (
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

                      {canManage && (
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

                {/* Announcements */}
                {announcements && announcements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Announcements</h3>
                    <div className="space-y-4">
                      {announcements.map((post) => (
                        <PostCard key={post._id} post={post} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Posts */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Discussions</h3>
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
                    <Message variant="info">No posts in this group yet. Be the first to post!</Message>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Message variant="error">Group not found</Message>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Delete Group</h2>
            <p className="mb-6">
              Are you sure you want to delete this group? This action cannot be undone and will remove all posts within
              the group.
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
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

export default GroupDetailsPage

