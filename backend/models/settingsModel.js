import mongoose from "mongoose"

const settingsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["general", "appearance", "privacy", "notifications", "system"],
    },
    description: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const Settings = mongoose.model("Settings", settingsSchema)

// Initialize default settings
export const initializeSettings = async () => {
  const defaultSettings = [
    {
      name: "siteName",
      value: "Connect",
      category: "general",
      description: "The name of the site",
      isPublic: true,
    },
    {
      name: "siteDescription",
      value: "Connecting Centennial College Students",
      category: "general",
      description: "A brief description of the site",
      isPublic: true,
    },
    {
      name: "primaryColor",
      value: "#16a34a", // green-600
      category: "appearance",
      description: "The primary color theme of the site",
      isPublic: true,
    },
    {
      name: "allowRegistration",
      value: true,
      category: "system",
      description: "Whether new user registration is allowed",
      isPublic: false,
    },
    {
      name: "maxEventsPerUser",
      value: 5,
      category: "system",
      description: "Maximum number of events a user can create",
      isPublic: false,
    },
    {
      name: "maxCommunitiesPerUser",
      value: 3,
      category: "system",
      description: "Maximum number of communities a user can create",
      isPublic: false,
    },
    {
      name: "enableJobBoard",
      value: true,
      category: "system",
      description: "Whether the job board feature is enabled",
      isPublic: true,
    },
    {
      name: "defaultPrivacy",
      value: "public",
      category: "privacy",
      description: "Default privacy setting for new content",
      isPublic: true,
    },
    {
      name: "emailNotifications",
      value: true,
      category: "notifications",
      description: "Whether email notifications are enabled by default",
      isPublic: true,
    },
  ]

  for (const setting of defaultSettings) {
    try {
      const existingSetting = await Settings.findOne({ name: setting.name })
      if (!existingSetting) {
        await Settings.create(setting)
      }
    } catch (error) {
      console.error(`Error initializing setting ${setting.name}:`, error)
    }
  }
}

export default Settings

