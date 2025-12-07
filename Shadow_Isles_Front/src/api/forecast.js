import apiClient from './client'

/**
 * 개인화된 예보 조회
 * GET /forecast
 * Auth가 있는 경우 개인화된 예보, 없는 경우 일반 예보
 * @returns {Promise} 예보 데이터
 */
export const getForecast = async () => {
  const response = await apiClient.get('/forecast')
  return response.data
}

/**
 * 특정 날짜의 예보 조회 (선택적 기능)
 * GET /forecast?date=YYYY-MM-DD
 * @param {string} date - 날짜 (YYYY-MM-DD 형식)
 * @returns {Promise} 예보 데이터
 */
export const getForecastByDate = async (date) => {
  const response = await apiClient.get('/forecast', {
    params: { date },
  })
  return response.data
}
