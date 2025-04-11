"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getFeedback, respondToFeedback } from "../slices/feedbackSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import { formatDate } from "../utils/formatDate"

const FeedbackPage = () => {
  const dispatch = useDispatch()
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [response, setResponse] = useState("")

  const { loading, error, feedback } = useSelector((state) => state.feedback)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (userInfo && userInfo.role === "admin") {
      dispatch(getFeedback())
    }
  }, [dispatch, userInfo])

  const handleRespond = (feedbackId) => {
    dispatch(respondToFeedback({ feedbackId, response }))
    setSelectedFeedback(null)
    setResponse("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-600">User Feedback</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : feedback && feedback.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">User</th>
                  <th className="py-3 px-6 text-left">Type</th>
                  <th className="py-3 px-6 text-left">Subject</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {feedback.map((item) => (
                  <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {item.user.profilePicture ? (
                            <img
                              src={item.user.profilePicture || "/placeholder.svg"}
                              alt={item.user.name}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">👤</span>
                            </div>
                          )}
                        </div>
                        <span>{item.user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="capitalize">{item.type}</span>
                    </td>
                    <td className="py-3 px-6 text-left">{item.subject}</td>
                    <td className="py-3 px-6 text-left">{formatDate(item.createdAt)}</td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <button
                        onClick={() => setSelectedFeedback(item)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Message variant="info">No feedback found.</Message>
      )}

      {/* Feedback Details Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Feedback Details</h2>
              <button onClick={() => setSelectedFeedback(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">From</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    {selectedFeedback.user.profilePicture ? (
                      <img
                        src={selectedFeedback.user.profilePicture || "/placeholder.svg"}
                        alt={selectedFeedback.user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">👤</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{selectedFeedback.user.name}</p>
                    <p className="text-sm text-gray-600">{selectedFeedback.user.email}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Type</p>
                <p className="capitalize">{selectedFeedback.type}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Subject</p>
                <p>{selectedFeedback.subject}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Message</p>
                <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line">{selectedFeedback.message}</div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Date Submitted</p>
                <p>{formatDate(selectedFeedback.createdAt)}</p>
              </div>

              {selectedFeedback.response && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Response</p>
                  <div className="bg-green-50 p-4 rounded-md whitespace-pre-line">{selectedFeedback.response}</div>
                </div>
              )}
            </div>

            {selectedFeedback.status === "pending" && (
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Respond to Feedback</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                  rows="4"
                  placeholder="Type your response here..."
                ></textarea>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedFeedback(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRespond(selectedFeedback._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={!response.trim()}
                  >
                    Send Response
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FeedbackPage

