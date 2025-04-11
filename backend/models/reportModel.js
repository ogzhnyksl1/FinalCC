import mongoose from "mongoose"

const reportSchema = mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reportType: {
      type: String,
      required: true,
      enum: ["user", "post", "comment"],
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reportedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    reportedComment: {
      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
      commentId: String,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "dismissed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
)

const Report = mongoose.model("Report", reportSchema)

export default Report

