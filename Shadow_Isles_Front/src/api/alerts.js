import apiClient from './client'

/**
 * 알람 목록 조회
 * GET /users/me/alerts
 * @returns {Promise} 알람 목록
 */
export const getAlerts = async () => {
  const response = await apiClient.get('/users/me/alerts')
  return response.data
}

/**
 * 알람 읽음 처리
 * PATCH /users/me/alerts/{alertId}/read
 * @param {string|number} alertId - 알람 ID
 * @returns {Promise} 업데이트 결과
 */
export const markAlertAsRead = async (alertId) => {
  const response = await apiClient.patch(`/users/me/alerts/${alertId}/read`)
  return response.data
}

/**
 * 모든 알람 읽음 처리 (선택적 기능)
 * @returns {Promise} 모든 알람 업데이트 결과
 */
export const markAllAlertsAsRead = async () => {
  const alerts = await getAlerts()
  const unreadAlerts = alerts.filter((alert) => !alert.isRead)

  const promises = unreadAlerts.map((alert) => markAlertAsRead(alert.id))
  return Promise.all(promises)
}
