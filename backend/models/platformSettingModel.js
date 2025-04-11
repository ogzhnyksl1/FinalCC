import mongoose from "mongoose"

const platformSettingSchema = mongoose.Schema(
  {
    key: {
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

const PlatformSetting = mongoose.model("PlatformSetting", platformSettingSchema)

// Initialize default settings
export const initializeSettings = async () => {
  const defaultSettings = [
    {
      key: "siteName",
      value: "Connect",
      category: "general",
      description: "The name of the site",
      isPublic: true,
    },
    {
      key: "siteDescription",
      value: "Connecting Centennial College Students",
      category: "general",
      description: "A brief description of the site",
      isPublic: true,
    },
    {
      key: "primaryColor",
      value: "#16a34a", // green-600
      category: "appearance",
      description: "The primary color theme of the site",
      isPublic: true,
    },
    {
      key: "allowRegistration",
      value: true,
      category: "system",
      description: "Whether new user registration is allowed",
      isPublic: false,
    },
    {
      key: "maxEventsPerUser",
      value: 5,
      category: "system",
      description: "Maximum number of events a user can create",
      isPublic: false,
    },
    {
      key: "maxCommunitiesPerUser",
      value: 3,
      category: "system",
      description: "Maximum number of communities a user can create",
      isPublic: false,
    },
    {
      key: "enableJobBoard",
      value: true,
      category: "system",
      description: "Whether the job board feature is enabled",
      isPublic: true,
    },
    {
      key: "defaultPrivacy",
      value: "public",
      category: "privacy",
      description: "Default privacy setting for new content",
      isPublic: true,
    },
    {
      key: "emailNotifications",
      value: true,
      category: "notifications",
      description: "Whether email notifications are enabled by default",
      isPublic: true,
    },
  ]

  for (const setting of defaultSettings) {
    try {
      const existingSetting = await PlatformSetting.findOne({ key: setting.key })
      if (!existingSetting) {
        await PlatformSetting.create(setting)
      }
    } catch (error) {
      console.error(`Error initializing setting ${setting.key}:`, error)
    }
  }
}

export default PlatformSetting

