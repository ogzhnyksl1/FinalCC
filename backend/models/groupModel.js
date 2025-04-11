import mongoose from "mongoose"

const groupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Community",
    },
    managers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Compound index to ensure unique group names within a community
groupSchema.index({ name: 1, community: 1 }, { unique: true })

const Group = mongoose.model("Group", groupSchema)

export default Group

