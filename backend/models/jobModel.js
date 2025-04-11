import mongoose from "mongoose"

const applicationSchema = mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    resume: {
      type: String,
      default: "",
    },
    coverLetter: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
)

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Temporary"],
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      default: "",
    },
    benefits: {
      type: String,
      default: "",
    },
    salary: {
      type: String,
      default: "",
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    applications: [applicationSchema],
    status: {
      type: String,
      enum: ["open", "closed", "filled"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
)

const Job = mongoose.model("Job", jobSchema)

export default Job

