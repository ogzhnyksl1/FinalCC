import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getPublicSettings = createAsyncThunk("settings/getPublicSettings", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/api/settings/public")
    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const getAllSettings = createAsyncThunk("settings/getAllSettings", async (_, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get("/api/settings", config)
    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

// Alias for getPlatformSettings
export const getPlatformSettings = getAllSettings

export const updateSetting = createAsyncThunk(
  "settings/updateSetting",
  async ({ name, value }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.put(`/api/settings/${name}`, { value }, config)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

// Function to update multiple platform settings at once
export const updatePlatformSettings = createAsyncThunk(
  "settings/updatePlatformSettings",
  async (settingsData, { getState, rejectWithValue, dispatch }) => {
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

      // Update each setting one by one
      const updatedSettings = []
      for (const [name, value] of Object.entries(settingsData)) {
        const { data } = await axios.put(`/api/settings/${name}`, { value }, config)
        updatedSettings.push(data)
      }

      return updatedSettings
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  publicSettings: {},
  allSettings: [],
  loading: false,
  error: null,
  success: false,
}

const settingsSlice = createSlice({
  name: "settings",
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
      .addCase(getPublicSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPublicSettings.fulfilled, (state, action) => {
        state.loading = false
        state.publicSettings = action.payload
        state.error = null
      })
      .addCase(getPublicSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getAllSettings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllSettings.fulfilled, (state, action) => {
        state.loading = false
        state.allSettings = action.payload
        state.error = null
      })
      .addCase(getAllSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateSetting.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updateSetting.fulfilled, (state, action) => {
        state.loading = false
        state.allSettings = state.allSettings.map((setting) =>
          setting.name === action.payload.name ? action.payload : setting,
        )
        state.success = true
        state.error = null
      })
      .addCase(updateSetting.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(updatePlatformSettings.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updatePlatformSettings.fulfilled, (state, action) => {
        state.loading = false
        // Update multiple settings in the state
        action.payload.forEach((updatedSetting) => {
          state.allSettings = state.allSettings.map((setting) =>
            setting.name === updatedSetting.name ? updatedSetting : setting,
          )
        })
        state.success = true
        state.error = null
      })
      .addCase(updatePlatformSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  },
})

export const { clearError, resetSuccess } = settingsSlice.actions

export default settingsSlice.reducer

