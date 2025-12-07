import apiClient from './client'

/**
 * 자신의 정보 조회
 * GET /users/me
 * @returns {Promise} 사용자 정보
 */
export const getMe = async () => {
  const response = await apiClient.get('/users/me')
  return response.data
}

/**
 * 계정 삭제
 * DELETE /users/me
 * @returns {Promise} 삭제 결과
 */
export const deleteAccount = async () => {
  const response = await apiClient.delete('/users/me')

  // 계정 삭제 후 토큰 제거
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')

  return response.data
}

/**
 * 유저 설정 받아오기
 * GET /users/me/settings
 * @returns {Promise} 사용자 설정
 */
export const getSettings = async () => {
  const response = await apiClient.get('/users/me/settings')
  return response.data
}

/**
 * 유저 설정 수정
 * PATCH /users/me/settings
 * @param {Object} settings - 수정할 설정 데이터
 * @returns {Promise} 수정된 설정
 */
export const updateSettings = async (settings) => {
  const response = await apiClient.patch('/users/me/settings', settings)
  return response.data
}
