import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getEvents = createAsyncThunk("events/getEvents", async (params, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
      params,
    }

    const { data } = await axios.get("/api/events", config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const getEventById = createAsyncThunk("events/getEventById", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/events/${id}`, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const createEvent = createAsyncThunk("events/createEvent", async (eventData, { getState, rejectWithValue }) => {
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

    const { data } = await axios.post("/api/events", eventData, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, eventData }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.put(`/api/events/${id}`, eventData, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const deleteEvent = createAsyncThunk("events/deleteEvent", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/events/${id}`, config)

    return id
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const registerForEvent = createAsyncThunk(
  "events/registerForEvent",
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(`/api/events/${id}/register`, {}, config)

      return { id, message: data.message }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const unregisterFromEvent = createAsyncThunk(
  "events/unregisterFromEvent",
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(`/api/events/${id}/unregister`, {}, config)

      return { id, message: data.message }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const addEventAnnouncement = createAsyncThunk(
  "events/addEventAnnouncement",
  async ({ id, message }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.post(`/api/events/${id}/announcements`, { message }, config)

      return { id, announcement: data }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  events: [],
  event: null,
  loading: false,
  error: null,
  success: false,
  message: null,
}

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetSuccess: (state) => {
      state.success = false
      state.message = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
        state.error = null
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getEventById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false
        state.event = action.payload
        state.error = null
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events.push(action.payload)
        state.success = true
        state.error = null
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events = state.events.map((event) => (event._id === action.payload._id ? action.payload : event))
        state.event = action.payload
        state.success = true
        state.error = null
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events = state.events.filter((event) => event._id !== action.payload)
        state.success = true
        state.message = "Event deleted successfully"
        state.error = null
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(registerForEvent.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.message = action.payload.message
        state.error = null
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(unregisterFromEvent.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(unregisterFromEvent.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.message = action.payload.message
        state.error = null
      })
      .addCase(unregisterFromEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(addEventAnnouncement.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(addEventAnnouncement.fulfilled, (state, action) => {
        state.loading = false
        if (state.event && state.event._id === action.payload.id) {
          state.event.announcements.push(action.payload.announcement)
        }
        state.success = true
        state.error = null
      })
      .addCase(addEventAnnouncement.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  },
})

export const { clearError, resetSuccess } = eventSlice.actions

export default eventSlice.reducer

