"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import FeedbackForm from "./FeedbackForm"
import "../styles/components/Footer.css"

const Footer = () => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-container">
          <div className="footer-logo">
            <h2 className="footer-logo-text">Connect</h2>
            <p className="footer-tagline">Connecting Centennial College Students</p>
          </div>

          <div className="footer-links">
            <div className="footer-links-column">
              <h3 className="footer-links-title">Quick Links</h3>
              <ul className="footer-links-list">
                <li>
                  <Link to="/" className="footer-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/communities" className="footer-link">
                    Communities
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="footer-link">
                    Events
                  </Link>
                </li>
                <li>
                  <Link to="/discussions" className="footer-link">
                    Discussions
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="footer-link">
                    Job Board
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3 className="footer-links-title">Support</h3>
              <ul className="footer-links-list">
                <li>
                  <button onClick={() => setShowFeedbackForm(true)} className="footer-button">
                    Send Feedback
                  </button>
                </li>
                <li>
                  <a
                    href="https://www.centennialcollege.ca/contact-us"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    Contact College
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Connect. All rights reserved.</p>
          <p>Made for Centennial College students. This is not an official Centennial College website.</p>
        </div>
      </div>

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <div className="modal-overlay">
          <FeedbackForm onClose={() => setShowFeedbackForm(false)} />
        </div>
      )}
    </footer>
  )
}

export default Footer

