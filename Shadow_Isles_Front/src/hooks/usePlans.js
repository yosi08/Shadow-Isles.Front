import { useState, useEffect, useCallback } from 'react'
import * as plansApi from '../api/plans'

/**
 * 계획 관리를 위한 커스텀 훅
 */
export const usePlans = () => {
  const [plans, setPlans] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // 계획 목록 불러오기
  const fetchPlans = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await plansApi.getPlans()
      setPlans(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch plans')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 계획 생성
  const createPlan = async (planData) => {
    setError(null)
    try {
      const newPlan = await plansApi.createPlan(planData)
      setPlans((prev) => [...prev, newPlan])
      return { success: true, data: newPlan }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create plan'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  // 계획 수정
  const updatePlan = async (planId, planData) => {
    setError(null)
    try {
      const updatedPlan = await plansApi.updatePlan(planId, planData)
      setPlans((prev) => prev.map((plan) => (plan.id === planId ? updatedPlan : plan)))
      return { success: true, data: updatedPlan }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update plan'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  // 계획 삭제
  const deletePlan = async (planId) => {
    setError(null)
    try {
      await plansApi.deletePlan(planId)
      setPlans((prev) => prev.filter((plan) => plan.id !== planId))
      return { success: true }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete plan'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  // 컴포넌트 마운트 시 계획 목록 불러오기
  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  return {
    plans,
    isLoading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
  }
}
