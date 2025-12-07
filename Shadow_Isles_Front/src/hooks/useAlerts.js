import { useState, useEffect, useCallback } from 'react'
import * as alertsApi from '../api/alerts'

/**
 * 알림 관리를 위한 커스텀 훅
 */
export const useAlerts = () => {
  const [alerts, setAlerts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // 알림 목록 불러오기
  const fetchAlerts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await alertsApi.getAlerts()
      setAlerts(data)

      // 읽지 않은 알림 개수 계산
      const unread = data.filter((alert) => !alert.isRead).length
      setUnreadCount(unread)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch alerts')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 알림 읽음 처리
  const markAsRead = async (alertId) => {
    setError(null)
    try {
      await alertsApi.markAlertAsRead(alertId)
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === alertId ? { ...alert, isRead: true } : alert))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
      return { success: true }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to mark alert as read'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  // 모든 알림 읽음 처리
  const markAllAsRead = async () => {
    setError(null)
    try {
      await alertsApi.markAllAlertsAsRead()
      setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })))
      setUnreadCount(0)
      return { success: true }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to mark all alerts as read'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  // 컴포넌트 마운트 시 알림 목록 불러오기
  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  return {
    alerts,
    isLoading,
    error,
    unreadCount,
    fetchAlerts,
    markAsRead,
    markAllAsRead,
  }
}
