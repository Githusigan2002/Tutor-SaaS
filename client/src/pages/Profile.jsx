import React from 'react'
import Navbar from '../components/Layout/Navbar'
import { useAuth } from '../contexts/AuthContext'

export default function Profile(){
  const { user } = useAuth()
  return (
    <div>
      {/* <Navbar/> */}
      <main className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-semibold">Profile</h2>
        <pre className="bg-white p-4 rounded mt-4">{JSON.stringify(user, null, 2)}</pre>
      </main>
    </div>
  )
}