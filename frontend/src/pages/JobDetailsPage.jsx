"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  getJobById,
  applyForJob,
  updateJobStatus,
  deleteJob,
  updateApplicationStatus,
  resetSuccess,
} from "../slices/jobSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import { formatDate } from "../utils/formatDate"

const JobDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [coverLetter, setCoverLetter] = useState("")
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)

  const { loading, error, job, success } = useSelector((state) => state.jobs)
  const { userInfo, userProfile } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getJobById(id))

    return () => {
      if (success) {
        dispatch(resetSuccess())
      }
    }
  }, [dispatch, id, success])

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(resetSuccess())
      }, 3000)
    }
  }, [dispatch, success])

  const handleApply = (e) => {
    e.preventDefault()
    dispatch(
      applyForJob({
        jobId: id,
        applicationData: {
          coverLetter,
          resume: userProfile?.resume || "",
        },
      }),
    )
    setShowApplyForm(false)
    setCoverLetter("")
  }

  const handleUpdateStatus = (status) => {
    dispatch(updateJobStatus({ id, status }))
  }

  const handleDeleteJob = () => {
    dispatch(deleteJob(id))
    navigate("/jobs")
  }

  const handleUpdateApplicationStatus = (applicationId, status) => {
    dispatch(
      updateApplicationStatus({
        jobId: id,
        applicationId,
        status,
      }),
    )
    setSelectedApplication(null)
  }

  const isEmployer = job && job.employer && job.employer._id === userInfo?._id
  const isAdmin = userInfo?.role === "admin"
  const hasApplied = job?.applications?.some((app) => app.applicant._id === userInfo?._id)
  const userApplication = job?.applications?.find((app) => app.applicant._id === userInfo?._id)

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : job ? (
        <div className="space-y-8">
          {success && <Message variant="success">Action completed successfully!</Message>}

          {/* Job Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center text-gray-600 mb-4">
                  <span className="mr-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {job.company}
                  </span>
                  <span className="mr-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {job.location}
                  </span>
                  <span className="mr-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {job.type}
                  </span>
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Posted on {formatDate(job.createdAt)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {job.category}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                      job.status === "open"
                        ? "bg-green-100 text-green-800"
                        : job.status === "closed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                  {job.salary && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {job.salary}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end space-y-2 mt-4 md:mt-0">
                {!isEmployer && !hasApplied && job.status === "open" && (
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Apply Now
                  </button>
                )}

                {hasApplied && userApplication && (
                  <div className="text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        userApplication.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : userApplication.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      Application Status:{" "}
                      {userApplication.status.charAt(0).toUpperCase() + userApplication.status.slice(1)}
                    </span>
                  </div>
                )}

                {isEmployer && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      {job.status === "open" ? (
                        <button
                          onClick={() => handleUpdateStatus("closed")}
                          className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-colors text-sm"
                        >
                          Close Job
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus("open")}
                          className="bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-700 transition-colors text-sm"
                        >
                          Reopen Job
                        </button>
                      )}
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-gray-600 text-white py-1 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    <span className="text-sm text-gray-600">
                      {job.applications?.length || 0} application(s) received
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{job.description}</p>
            </div>

            {job.requirements && (
              <>
                <h2 className="text-xl font-semibold mt-6 mb-4">Requirements</h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{job.requirements}</p>
                </div>
              </>
            )}

            {job.benefits && (
              <>
                <h2 className="text-xl font-semibold mt-6 mb-4">Benefits</h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{job.benefits}</p>
                </div>
              </>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-2">About the Employer</h3>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  {job.employer?.profilePicture ? (
                    <img
                      src={job.employer.profilePicture || "/placeholder.svg"}
                      alt={job.employer.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">👤</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{job.employer?.name}</p>
                  <p className="text-sm text-gray-600">{job.employer?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form Modal */}
          {showApplyForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-semibold mb-4">Apply for {job.title}</h2>

                {!userProfile?.resume && (
                  <Message variant="warning">
                    You haven't added a resume to your profile. Consider adding one before applying.
                    <Link to="/profile" className="block mt-2 text-green-600 hover:underline">
                      Update Profile
                    </Link>
                  </Message>
                )}

                <form onSubmit={handleApply}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="6"
                      placeholder="Explain why you're a good fit for this position..."
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowApplyForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-semibold mb-4">Delete Job Posting</h2>
                <p className="mb-6">Are you sure you want to delete this job posting? This action cannot be undone.</p>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteJob}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Applications Section (for employer) */}
          {isEmployer && job.applications && job.applications.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Applications ({job.applications.length})</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Applicant</th>
                      <th className="py-3 px-6 text-left">Applied On</th>
                      <th className="py-3 px-6 text-left">Status</th>
                      <th className="py-3 px-6 text-left">Resume</th>
                      <th className="py-3 px-6 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {job.applications.map((application) => (
                      <tr key={application._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left">
                          <div className="flex items-center">
                            <div className="mr-2">
                              {application.applicant.profilePicture ? (
                                <img
                                  src={application.applicant.profilePicture || "/placeholder.svg"}
                                  alt={application.applicant.name}
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500">👤</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="font-medium">{application.applicant.name}</span>
                              <div className="text-xs">{application.applicant.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-left">{formatDate(application.createdAt)}</td>
                        <td className="py-3 px-6 text-left">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              application.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : application.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-left">
                          {application.resume ? (
                            <a
                              href={application.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:underline"
                            >
                              View Resume
                            </a>
                          ) : (
                            <span className="text-gray-400">No resume</span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-left">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedApplication(application)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              View
                            </button>
                            {application.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleUpdateApplicationStatus(application._id, "accepted")}
                                  className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleUpdateApplicationStatus(application._id, "rejected")}
                                  className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-xs"
                                >
                                  Reject
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
          )}

          {/* Application Details Modal */}
          {selectedApplication && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">Application Details</h2>
                  <button onClick={() => setSelectedApplication(null)} className="text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      {selectedApplication.applicant.profilePicture ? (
                        <img
                          src={selectedApplication.applicant.profilePicture || "/placeholder.svg"}
                          alt={selectedApplication.applicant.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">👤</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{selectedApplication.applicant.name}</p>
                      <p className="text-sm text-gray-600">{selectedApplication.applicant.email}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Applied on</p>
                    <p>{formatDate(selectedApplication.createdAt)}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <p
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        selectedApplication.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedApplication.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                    </p>
                  </div>

                  {selectedApplication.resume && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Resume</p>
                      <a
                        href={selectedApplication.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        View Resume
                      </a>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Cover Letter</p>
                    <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line">
                      {selectedApplication.coverLetter}
                    </div>
                  </div>
                </div>

                {selectedApplication.status === "pending" && (
                  <div className="flex justify-end space-x-2 border-t pt-4">
                    <button
                      onClick={() => handleUpdateApplicationStatus(selectedApplication._id, "rejected")}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleUpdateApplicationStatus(selectedApplication._id, "accepted")}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Similar Jobs Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Similar Jobs</h2>

            {/* This would require additional data from the backend */}
            <p className="text-gray-500">No similar jobs found at the moment.</p>
          </div>
        </div>
      ) : (
        <Message variant="error">Job not found</Message>
      )}
    </div>
  )
}

export default JobDetailsPage

