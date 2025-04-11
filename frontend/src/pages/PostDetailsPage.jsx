"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getPostById, addComment, updatePost, deletePost } from "../slices/postSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import { formatDate } from "../utils/formatDate"
import ReportForm from "../components/ReportForm"

const PostDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [commentContent, setCommentContent] = useState("")
  const [showReportForm, setShowReportForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { loading, error, post, success } = useSelector((state) => state.posts)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getPostById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (post) {
      setEditTitle(post.title)
      setEditContent(post.content)
    }
  }, [post])

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    dispatch(addComment({ id, content: commentContent }))
    setCommentContent("")
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    dispatch(
      updatePost({
        id,
        postData: {
          title: editTitle,
          content: editContent,
        },
      }),
    )
    setShowEditForm(false)
  }

  const handleDeletePost = () => {
    dispatch(deletePost(id))
    navigate("/discussions")
  }

  const isAuthor = post?.author?._id === userInfo?._id
  const isAdmin = userInfo?.role === "admin"
  const isCommunityManager =
    userInfo?.role === "communityManager" &&
    post?.community &&
    post.community.managers?.some((manager) => manager._id === userInfo._id)

  const canEdit = isAuthor || isAdmin || isCommunityManager
  const canDelete = isAuthor || isAdmin || isCommunityManager

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : post ? (
        <div className="max-w-4xl mx-auto">
          {success && <Message variant="success">Action completed successfully!</Message>}

          {/* Post Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {!showEditForm ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                      {post.author?.profilePicture ? (
                        <img
                          src={post.author.profilePicture || "/placeholder.svg"}
                          alt={post.author.name}
                          className="h-12 w-12 object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">👤</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{post.author?.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(post.createdAt)}
                        {post.community && (
                          <>
                            {" • "}
                            <Link to={`/communities/${post.community._id}`} className="hover:underline">
                              {post.community.name}
                            </Link>
                          </>
                        )}
                        {post.group && (
                          <>
                            {" • "}
                            <Link to={`/groups/${post.group._id}`} className="hover:underline">
                              {post.group.name}
                            </Link>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {post.isAnnouncement && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Announcement</span>
                    )}
                    {post.isPinned && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Pinned</span>
                    )}
                    <button
                      onClick={() => setShowReportForm(true)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Report"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                <div className="prose max-w-none mb-6">
                  <p className="whitespace-pre-line">{post.content}</p>
                </div>

                {post.image && (
                  <div className="mb-6">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="max-w-full h-auto rounded-md"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span>{post.upvotes?.length || 0} upvotes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span>{post.comments?.length || 0} comments</span>
                    </div>
                  </div>

                  {canEdit && (
                    <div className="flex space-x-2">
                      <button onClick={() => setShowEditForm(true)} className="text-green-600 hover:text-green-700">
                        Edit
                      </button>
                      {canDelete && (
                        <button onClick={() => setShowDeleteConfirm(true)} className="text-red-600 hover:text-red-700">
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <form onSubmit={handleEditSubmit}>
                <h2 className="text-xl font-semibold mb-4">Edit Post</h2>
                <div className="mb-4">
                  <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="editTitle"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="editContent" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    id="editContent"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Comments ({post.comments?.length || 0})</h2>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Add a Comment
                </label>
                <textarea
                  id="comment"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </form>

            {/* Comments List */}
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-4">
                {post.comments.map((comment) => (
                  <div key={comment._id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start mb-2">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                        {comment.author?.profilePicture ? (
                          <img
                            src={comment.author.profilePicture || "/placeholder.svg"}
                            alt={comment.author.name}
                            className="h-8 w-8 object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">👤</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{comment.author?.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 ml-10">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>

          {/* Report Form Modal */}
          {showReportForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <ReportForm reportType="post" reportedId={post._id} onClose={() => setShowReportForm(false)} />
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-semibold mb-4">Delete Post</h2>
                <p className="mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Message variant="error">Post not found</Message>
      )}
    </div>
  )
}

export default PostDetailsPage

