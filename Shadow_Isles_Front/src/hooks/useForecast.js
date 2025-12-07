import { useState, useEffect, useCallback } from 'react'
import * as forecastApi from '../api/forecast'

/**
 * 예보 조회를 위한 커스텀 훅
 */
export const useForecast = (date = null) => {
  const [forecast, setForecast] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // 예보 불러오기
  const fetchForecast = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = date ? await forecastApi.getForecastByDate(date) : await forecastApi.getForecast()
      setForecast(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch forecast')
    } finally {
      setIsLoading(false)
    }
  }, [date])

  // 컴포넌트 마운트 시 예보 불러오기
  useEffect(() => {
    fetchForecast()
  }, [fetchForecast])

  return {
    forecast,
    isLoading,
    error,
    fetchForecast,
  }
}
