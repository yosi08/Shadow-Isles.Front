import { useAlerts } from '../hooks/useAlerts'
import './AlertsPanel.css'

function AlertsPanel() {
  const { alerts, isLoading, error, unreadCount, markAsRead, markAllAsRead, fetchAlerts } =
    useAlerts()

  if (isLoading) {
    return <div className="alerts-panel loading">Loading alerts...</div>
  }

  if (error) {
    return (
      <div className="alerts-panel error">
        <p>{error}</p>
        <button onClick={fetchAlerts}>Retry</button>
      </div>
    )
  }

  return (
    <div className="alerts-panel">
      <div className="alerts-header">
        <h2>
          Alerts {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </h2>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="mark-all-read-btn">
            Mark all as read
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="no-alerts">No alerts yet</div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-item ${alert.isRead ? 'read' : 'unread'}`}
              onClick={() => !alert.isRead && markAsRead(alert.id)}
            >
              <div className="alert-content">
                <h3>{alert.title}</h3>
                <p>{alert.message}</p>
                <span className="alert-time">{new Date(alert.createdAt).toLocaleString()}</span>
              </div>
              {!alert.isRead && <div className="unread-indicator"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AlertsPanel
