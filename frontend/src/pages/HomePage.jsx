"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getPosts } from "../slices/postSlice"
import { getEvents } from "../slices/eventSlice"
import { getCommunities } from "../slices/communitySlice"
import { getPublicSettings } from "../slices/settingsSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import PostCard from "../components/PostCard"
import EventCard from "../components/EventCard"
import "../styles/pages/HomePage.css"

const HomePage = () => {
  const dispatch = useDispatch()
  const [postContent, setPostContent] = useState("")

  const { userInfo } = useSelector((state) => state.auth)
  const { loading: postsLoading, error: postsError, posts } = useSelector((state) => state.posts)
  const { loading: eventsLoading, error: eventsError, events } = useSelector((state) => state.events)
  // Remove unused variable warning by commenting it out
  // const { publicSettings } = useSelector((state) => state.settings)

  useEffect(() => {
    dispatch(getPublicSettings())
    dispatch(getPosts({ isAnnouncement: false, limit: 5 }))
    dispatch(getEvents({ upcoming: true, limit: 5 }))
    dispatch(getCommunities())
  }, [dispatch])

  // Get recent posts
  const recentPosts = posts?.slice(0, 5)

  // Get upcoming events (next 5)
  const upcomingEvents = events
    ?.filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)

  const handleCreatePost = () => {
    // This would be implemented to create a new post
    console.log("Creating post:", postContent)
    setPostContent("")
  }

  return (
    <div className="container home-container">
      <div className="home-header">
        <h1 className="home-title">Welcome!</h1>
      </div>

      <div className="home-grid">
        {/* Left Column - Recent Posts */}
        <div>
          <div className="card post-section">
            <div className="card-body">
              <h2 className="section-title">Recent Posts</h2>

              {userInfo && (
                <div className="post-create">
                  <div className="post-create-inner">
                    <div className="post-avatar">
                      {userInfo.profilePicture ? (
                        <img src={userInfo.profilePicture || "/placeholder.svg"} alt={userInfo.name} />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <div className="post-input-container">
                      <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Hi, Do you want to share something?"
                        className="post-textarea"
                        rows="2"
                      ></textarea>
                      <div className="post-actions">
                        <button className="post-add-image">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Add Images
                        </button>
                        <button onClick={handleCreatePost} disabled={!postContent.trim()} className="post-submit">
                          Create Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {postsLoading ? (
                <Loader />
              ) : postsError ? (
                <Message variant="error">{postsError}</Message>
              ) : recentPosts && recentPosts.length > 0 ? (
                <div className="posts-list">
                  {recentPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <Message variant="info">No posts found.</Message>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Featured Events */}
        <div>
          <div className="card events-section">
            <div className="card-body">
              <h2 className="section-title">Featured Events</h2>

              {eventsLoading ? (
                <Loader />
              ) : eventsError ? (
                <Message variant="error">{eventsError}</Message>
              ) : upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="events-list">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <Message variant="info">No upcoming events found.</Message>
              )}

              <Link to="/events" className="view-all">
                View All Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

