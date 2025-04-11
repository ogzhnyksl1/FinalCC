import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getPlatformOverview = createAsyncThunk(
  "analytics/getPlatformOverview",
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get("/api/analytics/overview", config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const getCommunityAnalytics = createAsyncThunk(
  "analytics/getCommunityAnalytics",
  async (communityId, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get(`/api/analytics/communities/${communityId}`, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const getEventAnalytics = createAsyncThunk(
  "analytics/getEventAnalytics",
  async (eventId, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get(`/api/analytics/events/${eventId}`, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const getUserAnalytics = createAsyncThunk(
  "analytics/getUserAnalytics",
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get("/api/analytics/users", config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  platformOverview: null,
  communityAnalytics: null,
  eventAnalytics: null,
  userAnalytics: null,
  loading: false,
  error: null,
}

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetAnalytics: (state) => {
      state.platformOverview = null
      state.communityAnalytics = null
      state.eventAnalytics = null
      state.userAnalytics = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlatformOverview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPlatformOverview.fulfilled, (state, action) => {
        state.loading = false
        state.platformOverview = action.payload
        state.error = null
      })
      .addCase(getPlatformOverview.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getCommunityAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCommunityAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.communityAnalytics = action.payload
        state.error = null
      })
      .addCase(getCommunityAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getEventAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getEventAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.eventAnalytics = action.payload
        state.error = null
      })
      .addCase(getEventAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getUserAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.userAnalytics = action.payload
        state.error = null
      })
      .addCase(getUserAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, resetAnalytics } = analyticsSlice.actions

export default analyticsSlice.reducer

