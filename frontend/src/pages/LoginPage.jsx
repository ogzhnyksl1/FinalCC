"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../slices/authSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import "../styles/pages/LoginPage.css"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { loading, error, userInfo } = useSelector((state) => state.auth)

  const redirect = location.search ? location.search.split("=")[1] : "/"

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login({ email, password, rememberMe: keepLoggedIn }))
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome back</h1>
        </div>

        {error && <Message variant="error">{error}</Message>}

        <form className="login-form" onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter your password"
            />
          </div>

          <div className="form-row">
            <div className="form-check">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="form-check-input"
              />
              <label htmlFor="remember-me" className="form-check-label">
                Keep me logged in
              </label>
            </div>

            <button className="forgot-password" type="button">
              Forgot password?
            </button>
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? <Loader /> : "Sign in"}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-footer-text">
            Not a member yet?{" "}
            <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="login-footer-link">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

