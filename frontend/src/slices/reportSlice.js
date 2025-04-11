import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getReports = createAsyncThunk("reports/getReports", async (_, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get("/api/reports", config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const createReport = createAsyncThunk(
  "reports/createReport",
  async (reportData, { getState, rejectWithValue }) => {
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

      const { data } = await axios.post("/api/reports", reportData, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const updateReportStatus = createAsyncThunk(
  "reports/updateReportStatus",
  async ({ reportId, status }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.put(`/api/reports/${reportId}/status`, { status }, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  reports: [],
  report: null,
  loading: false,
  error: null,
  success: false,
}

const reportSlice = createSlice({
  name: "reports",
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
      .addCase(getReports.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.loading = false
        state.reports = action.payload
        state.error = null
      })
      .addCase(getReports.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createReport.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false
        state.report = action.payload
        state.success = true
        state.error = null
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(updateReportStatus.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        state.loading = false
        state.reports = state.reports.map((report) => (report._id === action.payload._id ? action.payload : report))
        state.success = true
        state.error = null
      })
      .addCase(updateReportStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  },
})

export const { clearError, resetSuccess } = reportSlice.actions

export default reportSlice.reducer

