import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import eventReducer from "./slices/eventSlice"
import communityReducer from "./slices/communitySlice"
import postReducer from "./slices/postSlice"
import searchReducer from "./slices/searchSlice"
import notificationReducer from "./slices/notificationSlice"
import jobReducer from "./slices/jobSlice"
import reportReducer from "./slices/reportSlice"
import feedbackReducer from "./slices/feedbackSlice"
import settingsReducer from "./slices/settingsSlice"
import analyticsReducer from "./slices/analyticsSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    communities: communityReducer,
    posts: postReducer,
    search: searchReducer,
    notifications: notificationReducer,
    jobs: jobReducer,
    reports: reportReducer,
    feedback: feedbackReducer,
    settings: settingsReducer,
    analytics: analyticsReducer,
  },
})

export default store

