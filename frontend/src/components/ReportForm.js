"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createReport, resetSuccess } from "../slices/reportSlice"
import Message from "./Message"

const ReportForm = ({ reportType, reportedId, postId, onClose }) => {
  const [reason, setReason] = useState("")

  const dispatch = useDispatch()
  const { loading, error, success } = useSelector((state) => state.reports)

  const handleSubmit = (e) => {
    e.preventDefault()

    const reportData = {
      reportType,
      reportedId,
      reason,
    }

    if (reportType === "comment") {
      reportData.postId = postId
      reportData.commentId = reportedId
    }

    dispatch(createReport(reportData))
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
        <h2 className="text-xl font-semibold">Report {reportType}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {error && <Message variant="error">{error}</Message>}
      {success && <Message variant="success">Report submitted successfully!</Message>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for reporting
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="4"
            placeholder="Please explain why you are reporting this content..."
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
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReportForm

