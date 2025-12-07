import { useState, useEffect } from 'react'
import { useSettings } from '../hooks/useSettings'
import { useAuth } from '../hooks/useAuth'
import './SettingsPage.css'

function SettingsPage() {
  const { settings, isLoading, error, updateSettings } = useSettings()
  const { user, logout } = useAuth()
  const [formData, setFormData] = useState({})
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveMessage('')

    const result = await updateSettings(formData)

    if (result.success) {
      setSaveMessage('Settings saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } else {
      setSaveMessage('Failed to save settings: ' + result.error)
    }
  }

  if (isLoading) {
    return (
      <div className="settings-page">
        <div className="loading">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>Settings</h1>

        {user && (
          <div className="user-info">
            <h2>User Information</h2>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h2>Preferences</h2>

          <div className="form-group">
            <label htmlFor="notifications">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={formData.notifications || false}
                onChange={handleChange}
              />
              Enable notifications
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              name="theme"
              value={formData.theme || 'light'}
              onChange={handleChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={formData.language || 'en'}
              onChange={handleChange}
            >
              <option value="en">English</option>
              <option value="ko">Korean</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}
          {saveMessage && (
            <div className={saveMessage.includes('Failed') ? 'error-message' : 'success-message'}>
              {saveMessage}
            </div>
          )}

          <button type="submit" className="save-button">
            Save Settings
          </button>
        </form>

        <div className="danger-zone">
          <h2>Danger Zone</h2>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
