import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  function login(userData, jwt) {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem('token', jwt)
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const value = { user, token, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
