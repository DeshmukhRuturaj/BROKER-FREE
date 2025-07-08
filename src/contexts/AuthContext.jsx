import React, { createContext, useContext, useState, useEffect } from 'react'
import { registerUser, loginUser, getCurrentUser } from '../services/api';
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      checkAuthStatus()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await getCurrentUser()
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await loginUser({ email, password })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    setUser(user)
    return response
  }

  const register = async (name, email, password, role) => {
    const response = await registerUser({ name, email, password, role })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    setUser(user)
    return response
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}