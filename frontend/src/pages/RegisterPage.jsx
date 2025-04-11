"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { register } from "../slices/authSlice"
import Message from "../components/Message"
import Loader from "../components/Loader"
import "../styles/pages/RegisterPage.css"

const RegisterPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState(null)
  const [role, setRole] = useState("user") // Default role is user (student)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error, userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (userInfo) {
      navigate("/")
    }
  }, [navigate, userInfo])

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@my\.centennialcollege\.ca$/
    return regex.test(email)
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
    } else if (!validateEmail(email)) {
      setMessage("Please use your Centennial College email (my.centennialcollege.ca)")
    } else {
      setMessage(null)
      dispatch(register({ name, email, password, role }))
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create an Account</h1>
          <p className="register-subtitle">Join the Centennial College community network</p>
        </div>

        <div className="register-body">
          {message && <Message variant="error">{message}</Message>}
          {error && <Message variant="error">{error}</Message>}
          {loading && <Loader />}

          <form onSubmit={submitHandler} className="register-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="your.id@my.centennialcollege.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <small className="form-text">
                You must use your Centennial College email address (my.centennialcollege.ca)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">I am a:</label>
              <div className="role-options">
                <div className="role-option">
                  <input
                    type="radio"
                    id="role-student"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={(e) => setRole(e.target.value)}
                    className="role-radio"
                  />
                  <label htmlFor="role-student" className="role-label">
                    Student
                  </label>
                </div>

                <div className="role-option">
                  <input
                    type="radio"
                    id="role-alumni"
                    name="role"
                    value="alumni"
                    checked={role === "alumni"}
                    onChange={(e) => setRole(e.target.value)}
                    className="role-radio"
                  />
                  <label htmlFor="role-alumni" className="role-label">
                    Alumni
                  </label>
                </div>

                <div className="role-option">
                  <input
                    type="radio"
                    id="role-community-manager"
                    name="role"
                    value="communityManager"
                    checked={role === "communityManager"}
                    onChange={(e) => setRole(e.target.value)}
                    className="role-radio"
                  />
                  <label htmlFor="role-community-manager" className="role-label">
                    Community Manager
                  </label>
                </div>

                <div className="role-option">
                  <input
                    type="radio"
                    id="role-event-manager"
                    name="role"
                    value="eventManager"
                    checked={role === "eventManager"}
                    onChange={(e) => setRole(e.target.value)}
                    className="role-radio"
                  />
                  <label htmlFor="role-event-manager" className="role-label">
                    Event Manager
                  </label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                Register
              </button>
            </div>
          </form>
        </div>

        <div className="register-footer">
          Already have an account?{" "}
          <Link to="/login" className="register-link">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
