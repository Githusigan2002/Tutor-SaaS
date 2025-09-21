import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Navbar(){
  const { user, logout } = useAuth()
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Tutor SaaS</div>
      <div className="space-x-4">
        <Link to="/" className="text-sm">Home</Link>
        {!user && <Link to="/login" className="text-sm">Login</Link>}
        {user && <Link to="/profile" className="text-sm">Profile</Link>}
        {user && <button onClick={logout} className="text-sm">Logout</button>}
      </div>
    </nav>
  )
}