import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import communityRoutes from "./routes/communityRoutes.js"
import groupRoutes from "./routes/groupRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import searchRoutes from "./routes/searchRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"
import feedbackRoutes from "./routes/feedbackRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import settingsRoutes from "./routes/settingsRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"

dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Welcome route
app.get("/", (req, res) => {
  res.send("API is running....")
})

// Routes
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/communities", communityRoutes)
app.use("/api/groups", groupRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/feedback", feedbackRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/settings", settingsRoutes)
app.use("/api/analytics", analyticsRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

