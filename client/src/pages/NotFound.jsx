import React from 'react'
import Navbar from '../components/Layout/Navbar'
export default function NotFound(){
  return (
    <div>
      <Navbar/>
      <main className="p-8">
        <h1 className="text-3xl">Page not found</h1>
      </main>
    </div>
  )
}