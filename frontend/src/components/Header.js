"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../slices/authSlice"
import { getNotifications, markAsRead } from "../slices/notificationSlice"
import NotificationList from "./NotificationList"
import "../styles/components/Header.css"

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const userMenuRef = useRef(null)
  const notificationRef = useRef(null)

  const { userInfo } = useSelector((state) => state.auth)
  const { notifications, unreadCount } = useSelector((state) => state.notifications)

  useEffect(() => {
    if (userInfo) {
      dispatch(getNotifications())
    }
  }, [dispatch, userInfo])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`)
      setSearchQuery("")
    }
  }

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      dispatch(markAsRead(notification._id))
    }
    setShowNotifications(false)
    navigate(notification.link)
  }

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  return (
    <header className="header">
      <div className="container header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-text">Connect</span>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Navigation - Desktop */}
        {userInfo ? (
          <nav className="nav-desktop">
            <Link to="/" className={`nav-link ${isActive("/") ? "nav-link-active" : ""}`}>
              Home
            </Link>
            <Link to="/communities" className={`nav-link ${isActive("/communities") ? "nav-link-active" : ""}`}>
              Community
            </Link>
            <Link to="/events" className={`nav-link ${isActive("/events") ? "nav-link-active" : ""}`}>
              Featured Events
            </Link>

            {/* Messages */}
            <Link to="/messages" className="icon-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </Link>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button onClick={() => setShowNotifications(!showNotifications)} className="icon-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>

              {showNotifications && (
                <div className="dropdown">
                  <NotificationList notifications={notifications} onNotificationClick={handleNotificationClick} />
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="avatar">
                {userInfo.profilePicture ? (
                  <img src={userInfo.profilePicture || "/placeholder.svg"} alt={userInfo.name} />
                ) : (
                  <span>👤</span>
                )}
              </button>

              {showUserMenu && (
                <div className="dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Profile
                  </Link>
                  <Link to="/notifications" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Notifications
                  </Link>

                  {userInfo.role === "admin" && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      Admin Dashboard
                    </Link>
                  )}

                  {(userInfo.role === "communityManager" || userInfo.role === "admin") && (
                    <Link to="/community-manager" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      Manage Communities
                    </Link>
                  )}

                  {(userInfo.role === "eventManager" || userInfo.role === "admin") && (
                    <Link to="/event-manager" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      Manage Events
                    </Link>
                  )}

                  <button onClick={handleLogout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        ) : (
          <div className="nav-desktop">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="mobile-menu-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {showMobileMenu ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <div className="container">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mobile-search">
              <div className="search-form">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>

            {userInfo ? (
              <div>
                <Link
                  to="/"
                  className={`mobile-nav-link ${isActive("/") ? "mobile-nav-link-active" : ""}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/communities"
                  className={`mobile-nav-link ${isActive("/communities") ? "mobile-nav-link-active" : ""}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Community
                </Link>
                <Link
                  to="/events"
                  className={`mobile-nav-link ${isActive("/events") ? "mobile-nav-link-active" : ""}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Featured Events
                </Link>
                <Link to="/messages" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                  Messages
                </Link>
                <Link to="/profile" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                  Profile
                </Link>
                <Link to="/notifications" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                  Notifications
                  {unreadCount > 0 && <span className="notification-badge ml-2">{unreadCount}</span>}
                </Link>

                {userInfo.role === "admin" && (
                  <Link to="/admin" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                    Admin Dashboard
                  </Link>
                )}

                {(userInfo.role === "communityManager" || userInfo.role === "admin") && (
                  <Link to="/community-manager" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                    Manage Communities
                  </Link>
                )}

                {(userInfo.role === "eventManager" || userInfo.role === "admin") && (
                  <Link to="/event-manager" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                    Manage Events
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout()
                    setShowMobileMenu(false)
                  }}
                  className="mobile-nav-link"
                  style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer" }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <Link to="/login" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                  Login
                </Link>
                <Link to="/register" className="mobile-nav-link" onClick={() => setShowMobileMenu(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

