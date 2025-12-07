import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import './App.css'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SettingsPage from './pages/SettingsPage'
import PlansPage from './pages/PlansPage'
import ForecastPage from './pages/ForecastPage'
import AlertsPanel from './components/AlertsPanel'
import HomePage from './pages/HomePage'

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="app-container">
      {isAuthenticated && (
        <nav className="main-nav">
          <div className="nav-brand">
            <Link to="/">Shadow Isles</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/plans">Plans</Link>
            <Link to="/forecast">Forecast</Link>
            <Link to="/alerts">Alerts</Link>
            <Link to="/settings">Settings</Link>
          </div>
          <div className="nav-user">{user?.username || 'User'}</div>
        </nav>
      )}

      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/plans"
            element={
              <PrivateRoute>
                <PlansPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/forecast"
            element={
              <PrivateRoute>
                <ForecastPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/alerts"
            element={
              <PrivateRoute>
                <AlertsPanel />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
