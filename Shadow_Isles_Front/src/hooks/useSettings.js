import { useState, useEffect, useCallback } from 'react'
import * as usersApi from '../api/users'

/**
 * 사용자 설정 관리를 위한 커스텀 훅
 */
export const useSettings = () => {
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // 설정 불러오기
  const fetchSettings = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await usersApi.getSettings()
      setSettings(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch settings')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 설정 업데이트
  const updateSettings = async (newSettings) => {
    setError(null)
    try {
      const updatedSettings = await usersApi.updateSettings(newSettings)
      setSettings(updatedSettings)
      return { success: true, data: updatedSettings }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update settings'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  // 컴포넌트 마운트 시 설정 불러오기
  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
  }
}
