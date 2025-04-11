import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
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

      const { data } = await axios.get("/api/users/notifications", config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const markAsRead = createAsyncThunk("notifications/markAsRead", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(`/api/users/notifications/${id}`, {}, config)

    return { id, notifications: data }
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
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

      const { data } = await axios.put("/api/users/notifications/read-all", {}, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,
}

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
        state.unreadCount = action.payload.filter((notification) => !notification.read).length
        state.error = null
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(markAsRead.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload.notifications
        state.unreadCount = action.payload.notifications.filter((notification) => !notification.read).length
        state.error = null
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(markAllAsRead.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(markAllAsRead.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
        state.unreadCount = 0
        state.error = null
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = notificationSlice.actions

export default notificationSlice.reducer

