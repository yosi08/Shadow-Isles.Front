import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

/**
 * 인증 관련 기능을 사용하기 위한 훅
 * @returns {Object} 인증 컨텍스트
 */
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
