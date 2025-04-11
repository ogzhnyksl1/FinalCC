"use client"

import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { search } from "../slices/searchSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import PostCard from "../components/PostCard"
import EventCard from "../components/EventCard"
import { formatDate } from "../utils/formatDate"

const SearchPage = () => {
  const location = useLocation()
  const dispatch = useDispatch()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("all")

  const { loading, error, results } = useSelector((state) => state.search)

  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get("query")
    if (query) {
      setSearchQuery(query)
      dispatch(search({ query }))
    }
  }, [dispatch, location.search])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      dispatch(search({ query: searchQuery, type: searchType !== "all" ? searchType : undefined }))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Search</h1>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Search for users, communities, events, posts..."
            />
          </div>
          <div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All</option>
              <option value="users">Users</option>
              <option value="communities">Communities</option>
              <option value="groups">Groups</option>
              <option value="events">Events</option>
              <option value="posts">Posts</option>
              <option value="jobs">Jobs</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Search Results */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : results ? (
        <div className="space-y-8">
          {/* Users Results */}
          {(searchType === "all" || searchType === "users") && results.users && results.users.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Users ({results.users.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.users.map((user) => (
                  <div key={user._id} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture || "/placeholder.svg"}
                          alt={user.name}
                          className="h-12 w-12 object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">👤</span>
                      )}
                    </div>
                    <div>
                      <Link to={`/users/${user._id}`} className="font-medium hover:text-green-600">
                        {user.name}
                      </Link>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {user.bio && <p className="text-sm text-gray-600 mt-1 line-clamp-1">{user.bio}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communities Results */}
          {(searchType === "all" || searchType === "communities") &&
            results.communities &&
            results.communities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Communities ({results.communities.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.communities.map((community) => (
                    <div key={community._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      {community.image ? (
                        <img
                          src={community.image || "/placeholder.svg"}
                          alt={community.name}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-lg">👥</span>
                        </div>
                      )}
                      <div className="p-4">
                        <Link to={`/communities/${community._id}`} className="font-medium hover:text-green-600">
                          <h3 className="text-lg font-semibold mb-2">{community.name}</h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{community.description}</p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">{community.members?.length || 0} members</span>
                          <Link to={`/communities/${community._id}`} className="text-green-600 hover:underline">
                            View Community
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Groups Results */}
          {(searchType === "all" || searchType === "groups") && results.groups && results.groups.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Groups ({results.groups.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.groups.map((group) => (
                  <div key={group._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {group.image ? (
                      <img
                        src={group.image || "/placeholder.svg"}
                        alt={group.name}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-lg">👥</span>
                      </div>
                    )}
                    <div className="p-4">
                      <Link to={`/groups/${group._id}`} className="font-medium hover:text-green-600">
                        <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{group.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">In {group.community?.name || "Community"}</span>
                        <Link to={`/groups/${group._id}`} className="text-green-600 hover:underline">
                          View Group
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Results */}
          {(searchType === "all" || searchType === "events") && results.events && results.events.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Events ({results.events.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* Posts Results */}
          {(searchType === "all" || searchType === "posts") && results.posts && results.posts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Posts ({results.posts.length})</h2>
              <div className="space-y-4">
                {results.posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* Jobs Results */}
          {(searchType === "all" || searchType === "jobs") && results.jobs && results.jobs.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Jobs ({results.jobs.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.jobs.map((job) => (
                  <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                      <Link to={`/jobs/${job._id}`} className="font-medium hover:text-green-600">
                        <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                      </Link>
                      <div className="flex flex-wrap items-center text-sm text-gray-600 mb-3">
                        <span className="mr-3">{job.company}</span>
                        <span className="mr-3">{job.location}</span>
                        <span>{job.type}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{formatDate(job.createdAt)}</span>
                        <Link to={`/jobs/${job._id}`} className="text-green-600 hover:underline">
                          View Job
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {Object.keys(results).every((key) => !results[key] || results[key].length === 0) && (
            <Message variant="info">No results found for "{searchQuery}". Try a different search term.</Message>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Enter a search term to find users, communities, events, and more.</p>
        </div>
      )}
    </div>
  )
}

export default SearchPage

