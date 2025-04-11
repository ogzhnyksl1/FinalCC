"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllSettings, updateSetting, resetSuccess } from "../slices/settingsSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"

const SettingsPage = () => {
  const dispatch = useDispatch()
  const [activeCategory, setActiveCategory] = useState("general")
  const [editMode, setEditMode] = useState({})
  const [editValues, setEditValues] = useState({})

  const { loading, error, allSettings, success } = useSelector((state) => state.settings)

  useEffect(() => {
    dispatch(getAllSettings())
  }, [dispatch])

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(resetSuccess())
      }, 3000)
    }
  }, [dispatch, success])

  const categories = ["general", "appearance", "privacy", "notifications", "system"]

  const filteredSettings = allSettings.filter((setting) => setting.category === activeCategory)

  const handleEdit = (setting) => {
    setEditMode({ ...editMode, [setting.name]: true })
    setEditValues({ ...editValues, [setting.name]: setting.value })
  }

  const handleCancel = (name) => {
    setEditMode({ ...editMode, [name]: false })
  }

  const handleSave = (setting) => {
    dispatch(
      updateSetting({
        name: setting.name,
        value: editValues[setting.name],
      }),
    )
    setEditMode({ ...editMode, [setting.name]: false })
  }

  const handleChange = (name, value) => {
    setEditValues({ ...editValues, [name]: value })
  }

  const renderSettingInput = (setting) => {
    const value = editValues[setting.name] !== undefined ? editValues[setting.name] : setting.value

    if (typeof setting.value === "boolean") {
      return (
        <select
          value={value.toString()}
          onChange={(e) => handleChange(setting.name, e.target.value === "true")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="true">Enabled</option>
          <option value="false">Disabled</option>
        </select>
      )
    } else if (typeof setting.value === "number") {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => handleChange(setting.name, Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      )
    } else if (setting.name === "primaryColor") {
      return (
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={value}
            onChange={(e) => handleChange(setting.name, e.target.value)}
            className="h-10 w-10 border-0"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(setting.name, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      )
    } else {
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(setting.name, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Platform Settings</h1>

      {success && <Message variant="success">Setting updated successfully!</Message>}
      {error && <Message variant="error">{error}</Message>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Categories Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 p-4 border-r border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      activeCategory === category ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6">
            <h2 className="text-xl font-semibold mb-4 capitalize">{activeCategory} Settings</h2>

            {loading ? (
              <Loader />
            ) : filteredSettings.length > 0 ? (
              <div className="space-y-6">
                {filteredSettings.map((setting) => (
                  <div key={setting.name} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{setting.name}</h3>
                        {setting.description && <p className="text-sm text-gray-500">{setting.description}</p>}
                      </div>
                      {!editMode[setting.name] ? (
                        <button
                          onClick={() => handleEdit(setting)}
                          className="text-green-600 hover:text-green-700 text-sm"
                        >
                          Edit
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleCancel(setting.name)}
                            className="text-gray-600 hover:text-gray-700 text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSave(setting)}
                            className="text-green-600 hover:text-green-700 text-sm"
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>

                    {!editMode[setting.name] ? (
                      <div className="mt-1">
                        {typeof setting.value === "boolean" ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              setting.value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {setting.value ? "Enabled" : "Disabled"}
                          </span>
                        ) : setting.name === "primaryColor" ? (
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full mr-2" style={{ backgroundColor: setting.value }}></div>
                            <span>{setting.value}</span>
                          </div>
                        ) : (
                          <span>{setting.value}</span>
                        )}
                      </div>
                    ) : (
                      <div className="mt-2">{renderSettingInput(setting)}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No settings found for this category.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage

