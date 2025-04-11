"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { upvotePost } from "../slices/postSlice"
import { formatDate } from "../utils/formatDate"
import ReportForm from "./ReportForm"
import "../styles/components/PostCard.css"

const PostCard = ({ post }) => {
  const [showReportForm, setShowReportForm] = useState(false)
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)

  const handleUpvote = () => {
    dispatch(upvotePost(post._id))
  }

  const isUpvoted = post.upvotes?.some((upvote) => upvote._id === userInfo?._id)

  return (
    <div className={`post-card ${post.isPinned ? "post-card-pinned" : ""}`}>
      <div className="post-card-body">
        {/* Post Header */}
        <div className="post-header">
          <div className="post-author">
            <div className="post-avatar">
              {post.author?.profilePicture ? (
                <img src={post.author.profilePicture || "/placeholder.svg"} alt={post.author.name} />
              ) : (
                <span>👤</span>
              )}
            </div>
            <div className="post-author-info">
              <p className="post-author-name">{post.author?.name}</p>
              <div className="post-meta">
                <span>{formatDate(post.createdAt)}</span>
                {post.community && (
                  <>
                    <span className="post-meta-separator">•</span>
                    <Link to={`/communities/${post.community._id}`} className="post-community-link">
                      {post.community.name}
                    </Link>
                  </>
                )}
                {post.group && (
                  <>
                    <span className="post-meta-separator">•</span>
                    <Link to={`/groups/${post.group._id}`} className="post-community-link">
                      {post.group.name}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="post-actions">
            <div className="post-badges">
              {post.isAnnouncement && <span className="post-badge post-badge-announcement">Announcement</span>}
              {post.isPinned && <span className="post-badge post-badge-pinned">Pinned</span>}
            </div>
            <button onClick={() => setShowReportForm(true)} className="post-action-button" title="Report">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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

        {/* Post Content */}
        <Link to={`/posts/${post._id}`}>
          <h3 className="post-title">
            <span className="post-title-link">{post.title}</span>
          </h3>
        </Link>
        <p className="post-content line-clamp-3">{post.content}</p>

        {post.image && <img src={post.image || "/placeholder.svg"} alt={post.title} className="post-image" />}

        {/* Post Footer */}
        <div className="post-footer">
          <div className="post-stats">
            <button onClick={handleUpvote} className={`post-stat-button ${isUpvoted ? "post-stat-button-active" : ""}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span>{post.upvotes?.length || 0}</span>
            </button>
            <Link to={`/posts/${post._id}`} className="post-stat">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
              <span>{post.comments?.length || 0}</span>
            </Link>
          </div>
          <Link to={`/posts/${post._id}`} className="post-read-more">
            Read More
          </Link>
        </div>
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="modal-overlay">
          <ReportForm reportType="post" reportedId={post._id} onClose={() => setShowReportForm(false)} />
        </div>
      )}
    </div>
  )
}

export default PostCard

