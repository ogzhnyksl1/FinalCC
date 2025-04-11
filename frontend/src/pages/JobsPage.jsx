"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getJobs } from "../slices/jobSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import JobCard from "../components/JobCard"

const JobsPage = () => {
  const dispatch = useDispatch()
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    status: "open",
  })
  const [searchTerm, setSearchTerm] = useState("")

  const { loading, error, jobs } = useSelector((state) => state.jobs)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getJobs())
  }, [dispatch])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredJobs = jobs?.filter((job) => {
    // Filter by search term
    if (
      searchTerm &&
      !job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !job.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !job.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Filter by category
    if (filters.category && job.category !== filters.category) {
      return false
    }

    // Filter by type
    if (filters.type && job.type !== filters.type) {
      return false
    }

    // Filter by status
    if (filters.status && job.status !== filters.status) {
      return false
    }

    return true
  })

  // Get unique categories and types for filter dropdowns
  const categories = jobs ? [...new Set(jobs.map((job) => job.category))].sort() : []
  const types = jobs ? [...new Set(jobs.map((job) => job.type))].sort() : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600 mb-4 md:mb-0">Job Board</h1>

        {userInfo && (userInfo.role === "admin" || userInfo.role === "eventManager") && (
          <Link
            to="/jobs/create"
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Post a Job
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by title, company, or location"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : filteredJobs && filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <Message variant="info">
          No jobs found. {filters.category || filters.type || searchTerm ? "Try adjusting your filters." : ""}
        </Message>
      )}
    </div>
  )
}

export default JobsPage

