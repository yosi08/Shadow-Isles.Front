import apiClient from './client'

/**
 * 유저 계획 읽어오기
 * GET /users/plan
 * @returns {Promise} 계획 목록
 */
export const getPlans = async () => {
  const response = await apiClient.get('/users/plan')
  return response.data
}

/**
 * 유저 계획 생성
 * POST /users/plan
 * @param {Object} planData - 계획 데이터 (제목, 내용, 시작일, 종료일 등)
 * @returns {Promise} 생성된 계획
 */
export const createPlan = async (planData) => {
  const response = await apiClient.post('/users/plan', planData)
  return response.data
}

/**
 * 유저 계획 수정
 * PUT /users/plan/{planId}
 * @param {string|number} planId - 계획 ID
 * @param {Object} planData - 수정할 계획 데이터
 * @returns {Promise} 수정된 계획
 */
export const updatePlan = async (planId, planData) => {
  const response = await apiClient.put(`/usesr/plan/${planId}`, planData)
  return response.data
}

/**
 * 유저 계획 삭제
 * DELETE /user/plan
 * @param {string|number} planId - 삭제할 계획 ID (쿼리 파라미터 또는 body로 전달)
 * @returns {Promise} 삭제 결과
 */
export const deletePlan = async (planId) => {
  const response = await apiClient.delete('/user/plan', {
    data: { planId }, // body에 planId 전달
  })
  return response.data
}
