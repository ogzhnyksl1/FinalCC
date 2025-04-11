import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getCommunities = createAsyncThunk(
  "communities/getCommunities",
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

      const { data } = await axios.get("/api/communities", config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const getCommunityById = createAsyncThunk(
  "communities/getCommunityById",
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

      const { data } = await axios.get(`/api/communities/${id}`, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

// Get group by ID
export const getGroupById = createAsyncThunk("communities/getGroupById", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/groups/${id}`, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

// Join group
export const joinGroup = createAsyncThunk("communities/joinGroup", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(`/api/groups/${id}/join`, {}, config)

    return { id, message: data.message }
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

// Leave group
export const leaveGroup = createAsyncThunk("communities/leaveGroup", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(`/api/groups/${id}/leave`, {}, config)

    return { id, message: data.message }
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

// Delete group
export const deleteGroup = createAsyncThunk("communities/deleteGroup", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/groups/${id}`, config)

    return id
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const createCommunity = createAsyncThunk(
  "communities/createCommunity",
  async (communityData, { getState, rejectWithValue }) => {
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

      const { data } = await axios.post("/api/communities", communityData, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const updateCommunity = createAsyncThunk(
  "communities/updateCommunity",
  async ({ id, communityData }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.put(`/api/communities/${id}`, communityData, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const deleteCommunity = createAsyncThunk(
  "communities/deleteCommunity",
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

      await axios.delete(`/api/communities/${id}`, config)

      return id
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const joinCommunity = createAsyncThunk(
  "communities/joinCommunity",
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

      const { data } = await axios.put(`/api/communities/${id}/join`, {}, config)

      return { id, message: data.message }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const leaveCommunity = createAsyncThunk(
  "communities/leaveCommunity",
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

      const { data } = await axios.put(`/api/communities/${id}/leave`, {}, config)

      return { id, message: data.message }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const addCommunityManager = createAsyncThunk(
  "communities/addCommunityManager",
  async ({ communityId, userId }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.put(`/api/communities/${communityId}/managers`, { userId }, config)

      return { communityId, message: data.message }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const removeCommunityManager = createAsyncThunk(
  "communities/removeCommunityManager",
  async ({ communityId, userId }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.delete(`/api/communities/${communityId}/managers/${userId}`, config)

      return { communityId, message: data.message }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  communities: [],
  community: null,
  group: null,
  loading: false,
  error: null,
  success: false,
  message: null,
}

const communitySlice = createSlice({
  name: "communities",
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
      .addCase(getCommunities.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCommunities.fulfilled, (state, action) => {
        state.loading = false
        state.communities = action.payload
        state.error = null
      })
      .addCase(getCommunities.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getCommunityById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCommunityById.fulfilled, (state, action) => {
        state.loading = false
        state.community = action.payload
        state.error = null
      })
      .addCase(getCommunityById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getGroupById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getGroupById.fulfilled, (state, action) => {
        state.loading = false
        state.group = action.payload
        state.error = null
      })
      .addCase(getGroupById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(joinGroup.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(joinGroup.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.message = action.payload.message
        state.error = null
      })
      .addCase(joinGroup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(leaveGroup.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.message = action.payload.message
        state.error = null
      })
      .addCase(leaveGroup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(deleteGroup.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.message = "Group deleted successfully"
        state.error = null
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(createCommunity.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.loading = false
        state.communities.push(action.payload)
        state.success = true
        state.error = null
      })
      .addCase(createCommunity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(updateCommunity.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updateCommunity.fulfilled, (state, action) => {
        state.loading = false
        state.communities = state.communities.map((community) =>
          community._id === action.payload._id ? action.payload : community,
        )
        state.community = action.payload
        state.success = true
        state.error = null
      })
      .addCase(updateCommunity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(deleteCommunity.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(deleteCommunity.fulfilled, (state, action) => {
        state.loading = false
        state.communities = state.communities.filter((community) => community._id !== action.payload)
        state.success = true
        state.message = "Community deleted successfully"
        state.error = null
      })
      .addCase(deleteCommunity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(joinCommunity.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(joinCommunity.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.message = action.payload.message
        state.error = null
      })
      .addCase(joinCommunity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(leaveCommunity.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(leaveCommunity.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.message = action.payload.message
        state.error = null
      })
      .addCase(leaveCommunity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(addCommunityManager.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(addCommunityManager.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.message = action.payload.message
        state.error = null
      })
      .addCase(addCommunityManager.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(removeCommunityManager.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(removeCommunityManager.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.message = action.payload.message
        state.error = null
      })
      .addCase(removeCommunityManager.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  },
})

export const { clearError, resetSuccess } = communitySlice.actions

export default communitySlice.reducer

