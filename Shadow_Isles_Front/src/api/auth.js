import apiClient from './client'

/**
 * 회원가입
 * POST /auth/register
 * @param {Object} userData - { username, email, password }
 * @returns {Promise} 회원가입 결과
 */
export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData)
  return response.data
}

/**
 * 로그인
 * POST /auth/login
 * @param {Object} credentials - { email, password }
 * @returns {Promise} 로그인 결과 (토큰 포함)
 */
export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials)

  // 토큰을 로컬 스토리지에 저장
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken)
  }
  if (response.data.refreshToken) {
    localStorage.setItem('refreshToken', response.data.refreshToken)
  }

  return response.data
}

/**
 * 액세스 토큰 재발급
 * POST /auth/refresh
 * @param {string} refreshToken - 리프레시 토큰
 * @returns {Promise} 새로운 액세스 토큰
 */
export const refreshToken = async (refreshToken) => {
  const response = await apiClient.post('/auth/refresh', { refreshToken })

  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken)
  }

  return response.data
}

/**
 * 현재 세션 로그아웃
 * POST /auth/logout
 * @returns {Promise} 로그아웃 결과
 */
export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout')
    return response.data
  } finally {
    // 성공/실패 여부와 관계없이 로컬 스토리지 클리어
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

/**
 * 모든 디바이스에서 로그아웃
 * POST /auth/logout/all
 * @returns {Promise} 로그아웃 결과
 */
export const logoutAll = async () => {
  try {
    const response = await apiClient.post('/auth/logout/all')
    return response.data
  } finally {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}
