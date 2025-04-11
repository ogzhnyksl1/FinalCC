import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getFeedback = createAsyncThunk("feedback/getFeedback", async (_, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get("/api/feedback", config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const submitFeedback = createAsyncThunk(
  "feedback/submitFeedback",
  async (feedbackData, { getState, rejectWithValue }) => {
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

      const { data } = await axios.post("/api/feedback", feedbackData, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const respondToFeedback = createAsyncThunk(
  "feedback/respondToFeedback",
  async ({ feedbackId, response }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.put(`/api/feedback/${feedbackId}/respond`, { response }, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  feedback: [],
  loading: false,
  error: null,
  success: false,
}

const feedbackSlice = createSlice({
  name: "feedback",
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
      .addCase(getFeedback.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getFeedback.fulfilled, (state, action) => {
        state.loading = false
        state.feedback = action.payload
        state.error = null
      })
      .addCase(getFeedback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(respondToFeedback.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(respondToFeedback.fulfilled, (state, action) => {
        state.loading = false
        state.feedback = state.feedback.map((item) => (item._id === action.payload._id ? action.payload : item))
        state.success = true
        state.error = null
      })
      .addCase(respondToFeedback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  },
})

export const { clearError, resetSuccess } = feedbackSlice.actions

export default feedbackSlice.reducer

