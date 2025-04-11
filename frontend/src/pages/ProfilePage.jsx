"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserProfile, updateUserProfile, uploadResume } from "../slices/authSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import "../styles/pages/ProfilePage.css"

const ProfilePage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [bio, setBio] = useState("")
  const [profilePicture, setProfilePicture] = useState("")
  const [resume, setResume] = useState("")
  const [message, setMessage] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [resumeFile, setResumeFile] = useState(null)
  const [uploadingResume, setUploadingResume] = useState(false)

  const dispatch = useDispatch()

  const { userProfile, loading, error, success } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!userProfile) {
      dispatch(getUserProfile())
    } else {
      setName(userProfile.name)
      setEmail(userProfile.email)
      setBio(userProfile.bio || "")
      setProfilePicture(userProfile.profilePicture || "")
      setResume(userProfile.resume || "")
    }
  }, [dispatch, userProfile])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
    } else {
      setMessage(null)
      dispatch(
        updateUserProfile({
          name,
          email,
          password: password ? password : undefined,
          bio,
          profilePicture,
        }),
      )
    }
  }

  const handleResumeUpload = async (e) => {
    e.preventDefault()
    if (!resumeFile) {
      setMessage("Please select a file to upload")
      return
    }

    // In a real implementation, this would handle file upload to a storage service
    // For now, we'll simulate the upload
    setUploadingResume(true)

    // Simulate file upload delay
    setTimeout(() => {
      // Create a fake URL for the resume
      const fakeResumeUrl = URL.createObjectURL(resumeFile)

      dispatch(uploadResume({ resumeUrl: fakeResumeUrl }))
      setUploadingResume(false)
      setResume(fakeResumeUrl)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-600">Your Profile</h1>

        {/* Profile Card - Added to show profile picture */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6 flex flex-col md:flex-row items-center">
          <div className="max-w-[200px] max-h-[200px] rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6 border-4 border-green-100">

              {profilePicture ? (
                <img
                  src={profilePicture || "/placeholder.svg"}
                  alt={name}
                  className="w-full h-full object-cover rounded-full "
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://via.placeholder.com/150?text=Profile"
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">{name || "Your Name"}</h2>
              <p className="text-gray-600 mb-2">{email || "your.email@example.com"}</p>
              <p className="text-gray-700">{bio || "No bio available"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          
          <div className="flex border-b border-gray-200 space-x-4 px-4">
            <button
              className={`py-3 px-4 font-medium rounded-t-lg ${
                activeTab === "profile"
                  ? "border-b-2 border-green-600 text-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`py-3 px-4 font-medium rounded-t-lg ${
                activeTab === "resume"
                  ? "border-b-2 border-green-600 text-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("resume")}
            >
              Resume
            </button>
            <button
              className={`py-3 px-4 font-medium rounded-t-lg ${
                activeTab === "security"
                  ? "border-b-2 border-green-600 text-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("security")}
            >
              Security
            </button>
          </div>

          <div className="p-6">
            {message && <Message variant="error">{message}</Message>}
            {error && <Message variant="error">{error}</Message>}
            {success && <Message variant="success">Profile Updated Successfully</Message>}
            {loading && <Loader />}

            {activeTab === "profile" && (
              <form onSubmit={submitHandler}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Picture URL
                    </label>
                    <input
                      type="text"
                      id="profilePicture"
                      value={profilePicture}
                      onChange={(e) => setProfilePicture(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://example.com/your-image.jpg"
                    />
                    <p className="mt-1 text-xs text-gray-500">Enter a URL for your profile picture</p>
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="btn-primary bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === "resume" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Resume Management</h2>

                {resume ? (
                  <div className="mb-6 p-4 border border-gray-200 rounded-md">
                    <h3 className="font-medium mb-2">Current Resume</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-gray-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>Resume.pdf</span>
                      </div>
                      <div>
                        <a
                          href={resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline mr-4"
                        >
                          View
                        </a>
                        <button onClick={() => setResume("")} className="text-red-600 hover:underline">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mb-4 text-gray-600">You haven't uploaded a resume yet.</p>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-2">Upload New Resume</h3>
                  <form onSubmit={handleResumeUpload}>
                    <div className="mb-4">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      <p className="mt-1 text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX</p>
                    </div>
                    <button
                      type="submit"
                      disabled={uploadingResume || !resumeFile}
                      className="btn-primary bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {uploadingResume ? "Uploading..." : "Upload Resume"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <form onSubmit={submitHandler}>
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="btn-primary bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
