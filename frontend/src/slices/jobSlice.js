import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getJobs = createAsyncThunk("jobs/getJobs", async (_, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get("/api/jobs", config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const getJobById = createAsyncThunk("jobs/getJobById", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/jobs/${id}`, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const createJob = createAsyncThunk("jobs/createJob", async (jobData, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post("/api/jobs", jobData, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const updateJobStatus = createAsyncThunk(
  "jobs/updateJobStatus",
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(`/api/jobs/${id}/status`, { status }, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const deleteJob = createAsyncThunk("jobs/deleteJob", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/jobs/${id}`, config)

    return id
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const applyForJob = createAsyncThunk(
  "jobs/applyForJob",
  async ({ jobId, applicationData }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.post(`/api/jobs/${jobId}/apply`, applicationData, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const updateApplicationStatus = createAsyncThunk(
  "jobs/updateApplicationStatus",
  async ({ jobId, applicationId, status }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(`/api/jobs/${jobId}/applications/${applicationId}`, { status }, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  jobs: [],
  job: null,
  loading: false,
  error: null,
  success: false,
}

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetSuccess: (state) => {
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJobs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.loading = false
        state.jobs = action.payload
        state.error = null
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getJobById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.loading = false
        state.job = action.payload
        state.error = null
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createJob.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false
        state.jobs.push(action.payload)
        state.success = true
        state.error = null
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(updateJobStatus.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        state.loading = false
        state.job = action.payload
        state.jobs = state.jobs.map((job) => (job._id === action.payload._id ? action.payload : job))
        state.success = true
        state.error = null
      })
      .addCase(updateJobStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(deleteJob.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false
        state.jobs = state.jobs.filter((job) => job._id !== action.payload)
        state.job = null
        state.success = true
        state.error = null
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(applyForJob.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false
        state.job = action.payload
        state.success = true
        state.error = null
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false
        state.job = action.payload
        state.success = true
        state.error = null
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  },
})

export const { clearError, resetSuccess } = jobSlice.actions

export default jobSlice.reducer

