import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar({role}){
  const items = {
    student: ['Home','Tutors','Bookings','Payments','Attendance'],
    tutor: ['Home','Students','Bookings','Payments','Attendance'],
    admin: ['Dashboard','Users','Bookings','Payments','Reports']
  }

  return (
    <aside className="w-64 bg-white p-4 border-r min-h-screen">
      <ul className="space-y-2">
        {(items[role]||[]).map(i=> (
          <li key={i}><Link to="#" className="block p-2 hover:bg-gray-100 rounded">{i}</Link></li>
        ))}
      </ul>
    </aside>
  )
}