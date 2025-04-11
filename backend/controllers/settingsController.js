import asyncHandler from "express-async-handler"
import Settings from "../models/settingsModel.js"

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
const getAllSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.find({})
  res.json(settings)
})

// @desc    Get public settings
// @route   GET /api/settings/public
// @access  Public
const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.find({ isPublic: true })

  // Convert to key-value format for easier client-side use
  const formattedSettings = settings.reduce((acc, setting) => {
    acc[setting.name] = setting.value
    return acc
  }, {})

  res.json(formattedSettings)
})

// @desc    Get setting by name
// @route   GET /api/settings/:name
// @access  Private/Admin
const getSettingByName = asyncHandler(async (req, res) => {
  const setting = await Settings.findOne({ name: req.params.name })

  if (setting) {
    res.json(setting)
  } else {
    res.status(404)
    throw new Error("Setting not found")
  }
})

// @desc    Update setting
// @route   PUT /api/settings/:name
// @access  Private/Admin
const updateSetting = asyncHandler(async (req, res) => {
  const { value } = req.body

  const setting = await Settings.findOne({ name: req.params.name })

  if (setting) {
    setting.value = value

    const updatedSetting = await setting.save()
    res.json(updatedSetting)
  } else {
    res.status(404)
    throw new Error("Setting not found")
  }
})

// @desc    Create setting
// @route   POST /api/settings
// @access  Private/Admin
const createSetting = asyncHandler(async (req, res) => {
  const { name, value, category, description, isPublic } = req.body

  const settingExists = await Settings.findOne({ name })

  if (settingExists) {
    res.status(400)
    throw new Error("Setting already exists")
  }

  const setting = await Settings.create({
    name,
    value,
    category,
    description: description || "",
    isPublic: isPublic || false,
  })

  if (setting) {
    res.status(201).json(setting)
  } else {
    res.status(400)
    throw new Error("Invalid setting data")
  }
})

// @desc    Delete setting
// @route   DELETE /api/settings/:name
// @access  Private/Admin
const deleteSetting = asyncHandler(async (req, res) => {
  const setting = await Settings.findOne({ name: req.params.name })

  if (setting) {
    await setting.remove()
    res.json({ message: "Setting removed" })
  } else {
    res.status(404)
    throw new Error("Setting not found")
  }
})

// @desc    Get settings by category
// @route   GET /api/settings/category/:category
// @access  Private/Admin
const getSettingsByCategory = asyncHandler(async (req, res) => {
  const settings = await Settings.find({ category: req.params.category })

  if (settings.length > 0) {
    res.json(settings)
  } else {
    res.status(404)
    throw new Error("No settings found for this category")
  }
})

export {
  getAllSettings,
  getPublicSettings,
  getSettingByName,
  updateSetting,
  createSetting,
  deleteSetting,
  getSettingsByCategory,
}

