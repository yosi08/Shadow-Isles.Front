import { createContext, useState, useEffect, useCallback } from 'react'
import * as authApi from '../api/auth'
import * as usersApi from '../api/users'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 토큰 확인 및 사용자 정보 로드
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const userData = await usersApi.getMe()
      setUser(userData)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Failed to load user:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  // 회원가입
  const register = async (userData) => {
    try {
      const response = await authApi.register(userData)
      return { success: true, data: response }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      }
    }
  }

  // 로그인
  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials)
      const userData = await usersApi.getMe()
      setUser(userData)
      setIsAuthenticated(true)
      return { success: true, data: response }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      }
    }
  }

  // 로그아웃
  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  // 모든 디바이스에서 로그아웃
  const logoutAll = async () => {
    try {
      await authApi.logoutAll()
    } catch (error) {
      console.error('Logout all error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  // 사용자 정보 새로고침
  const refreshUser = async () => {
    try {
      const userData = await usersApi.getMe()
      setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    logoutAll,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
