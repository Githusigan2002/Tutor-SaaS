import React from 'react'
import Navbar from '../../components/Layout/Navbar'
import Sidebar from '../../components/Layout/Sidebar'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminDashboard(){
  const { user } = useAuth()
  return (
    <div className="flex">
      <Sidebar role={user?.role} />
      <div className="flex-1">
        <Navbar/>
        <main className="p-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </main>
      </div>
    </div>
  )
}