import React from 'react'
import Navbar from '../components/Layout/Navbar'

export default function Home(){
  return (
    <div>
      {/* <Navbar/> */}
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Tutor Management SaaS</h1>
        <p className="mb-6">Browse tutors, book sessions, upload payment proof, and track attendance.</p>
      </main>
    </div>
  )
}