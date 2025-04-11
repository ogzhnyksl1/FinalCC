"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getReports, updateReportStatus } from "../slices/reportSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import { formatDate } from "../utils/formatDate"

const ReportsPage = () => {
  const dispatch = useDispatch()
  const [selectedReport, setSelectedReport] = useState(null)

  const { loading, error, reports } = useSelector((state) => state.reports)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (userInfo && (userInfo.role === "admin" || userInfo.role === "communityManager")) {
      dispatch(getReports())
    }
  }, [dispatch, userInfo])

  const handleUpdateStatus = (reportId, status) => {
    dispatch(updateReportStatus({ reportId, status }))
    setSelectedReport(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Reports Management</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : reports && reports.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Reporter</th>
                  <th className="py-3 px-6 text-left">Type</th>
                  <th className="py-3 px-6 text-left">Reported Item</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {reports.map((report) => (
                  <tr key={report._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {report.reporter.profilePicture ? (
                            <img
                              src={report.reporter.profilePicture || "/placeholder.svg"}
                              alt={report.reporter.name}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">👤</span>
                            </div>
                          )}
                        </div>
                        <span>{report.reporter.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="capitalize">{report.reportType}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {report.reportType === "user" && report.reportedUser?.name}
                      {report.reportType === "post" && report.reportedPost?.title}
                      {report.reportType === "comment" && "Comment"}
                    </td>
                    <td className="py-3 px-6 text-left">{formatDate(report.createdAt)}</td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          report.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : report.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          View
                        </button>
                        {report.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(report._id, "resolved")}
                              className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(report._id, "dismissed")}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-xs"
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Message variant="info">No reports found.</Message>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Report Details</h2>
              <button onClick={() => setSelectedReport(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Reporter</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    {selectedReport.reporter.profilePicture ? (
                      <img
                        src={selectedReport.reporter.profilePicture || "/placeholder.svg"}
                        alt={selectedReport.reporter.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">👤</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{selectedReport.reporter.name}</p>
                    <p className="text-sm text-gray-600">{selectedReport.reporter.email}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Report Type</p>
                <p className="capitalize">{selectedReport.reportType}</p>
              </div>

              {selectedReport.reportType === "user" && selectedReport.reportedUser && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Reported User</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      {selectedReport.reportedUser.profilePicture ? (
                        <img
                          src={selectedReport.reportedUser.profilePicture || "/placeholder.svg"}
                          alt={selectedReport.reportedUser.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">👤</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{selectedReport.reportedUser.name}</p>
                      <p className="text-sm text-gray-600">{selectedReport.reportedUser.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedReport.reportType === "post" && selectedReport.reportedPost && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Reported Post</p>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">{selectedReport.reportedPost.title}</p>
                    <p className="text-sm mt-1">{selectedReport.reportedPost.content}</p>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Reason</p>
                <div className="bg-gray-50 p-4 rounded-md">{selectedReport.reason}</div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Date Reported</p>
                <p>{formatDate(selectedReport.createdAt)}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p
                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                    selectedReport.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedReport.status === "resolved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                </p>
              </div>
            </div>

            {selectedReport.status === "pending" && (
              <div className="flex justify-end space-x-2 border-t pt-4">
                <button
                  onClick={() => handleUpdateStatus(selectedReport._id, "dismissed")}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReport._id, "resolved")}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Resolve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportsPage

