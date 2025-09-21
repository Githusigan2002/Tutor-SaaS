import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)
  useEffect(()=>{
    const raw = localStorage.getItem('tutor_user')
    if(raw) setUser(JSON.parse(raw))
  },[])

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password })
    const data = res.data
    // store tokens/user
    localStorage.setItem('tutor_user', JSON.stringify(data.user || data))
    if(data.accessToken) localStorage.setItem('tutor_token', data.accessToken)
    setUser(data.user || { email })
    return data
  }

  const logout = () => {
    localStorage.removeItem('tutor_user')
    localStorage.removeItem('tutor_token')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)