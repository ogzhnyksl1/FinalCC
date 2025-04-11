"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { submitFeedback, resetSuccess } from "../slices/feedbackSlice"
import Message from "./Message"

const FeedbackForm = ({ onClose }) => {
  const [type, setType] = useState("general")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const dispatch = useDispatch()
  const { loading, error, success } = useSelector((state) => state.feedback)

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(
      submitFeedback({
        type,
        subject,
        message,
      }),
    )
  }

  if (success) {
    setTimeout(() => {
      dispatch(resetSuccess())
      onClose()
    }, 2000)
  }

  return (
    <div className="bg-white rounded-lg p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Send Feedback</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {error && <Message variant="error">{error}</Message>}
      {success && <Message variant="success">Feedback submitted successfully!</Message>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Feedback Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="general">General Feedback</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Brief subject of your feedback"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="4"
            placeholder="Please provide details about your feedback..."
            required
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FeedbackForm

