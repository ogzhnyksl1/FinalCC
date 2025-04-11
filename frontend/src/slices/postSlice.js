import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getPosts = createAsyncThunk("posts/getPosts", async (params, { getState, rejectWithValue }) => {
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

    const { data } = await axios.get("/api/posts", config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const getPostById = createAsyncThunk("posts/getPostById", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get(`/api/posts/${id}`, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const createPost = createAsyncThunk("posts/createPost", async (postData, { getState, rejectWithValue }) => {
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

    const { data } = await axios.post("/api/posts", postData, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, postData }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.put(`/api/posts/${id}`, postData, config)

      return data
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const deletePost = createAsyncThunk("posts/deletePost", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/posts/${id}`, config)

    return id
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const upvotePost = createAsyncThunk("posts/upvotePost", async (id, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(`/api/posts/${id}/upvote`, {}, config)

    return data
  } catch (error) {
    return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message)
  }
})

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ id, content }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.post(`/api/posts/${id}/comments`, { content }, config)

      return { postId: id, comment: data }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const updateComment = createAsyncThunk(
  "posts/updateComment",
  async ({ postId, commentId, content }, { getState, rejectWithValue }) => {
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

      const { data } = await axios.put(`/api/posts/${postId}/comments/${commentId}`, { content }, config)

      return { postId, commentId, updatedComment: data }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ postId, commentId }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      await axios.delete(`/api/posts/${postId}/comments/${commentId}`, config)

      return { postId, commentId }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message ? error.response.data.message : error.message,
      )
    }
  },
)

const initialState = {
  posts: [],
  post: null,
  loading: false,
  error: null,
  success: false,
}

const postSlice = createSlice({
  name: "posts",
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
      .addCase(getPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload
        state.error = null
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getPostById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false
        state.post = action.payload
        state.error = null
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false
        state.posts.unshift(action.payload)
        state.success = true
        state.error = null
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false
        state.posts = state.posts.map((post) => (post._id === action.payload._id ? action.payload : post))
        state.post = action.payload
        state.success = true
        state.error = null
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false
        state.posts = state.posts.filter((post) => post._id !== action.payload)
        state.post = null
        state.success = true
        state.error = null
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(upvotePost.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(upvotePost.fulfilled, (state, action) => {
        state.loading = false
        state.posts = state.posts.map((post) => (post._id === action.payload._id ? action.payload : post))
        if (state.post && state.post._id === action.payload._id) {
          state.post = action.payload
        }
        state.error = null
      })
      .addCase(upvotePost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false
        if (state.post && state.post._id === action.payload.postId) {
          state.post.comments.push(action.payload.comment)
        }
        state.error = null
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateComment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false
        if (state.post && state.post._id === action.payload.postId) {
          state.post.comments = state.post.comments.map((comment) =>
            comment._id === action.payload.commentId ? action.payload.updatedComment : comment,
          )
        }
        state.error = null
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteComment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false
        if (state.post && state.post._id === action.payload.postId) {
          state.post.comments = state.post.comments.filter((comment) => comment._id !== action.payload.commentId)
        }
        state.error = null
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, resetSuccess } = postSlice.actions

export default postSlice.reducer

