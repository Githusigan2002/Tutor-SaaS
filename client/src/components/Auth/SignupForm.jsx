import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function SignupForm(){
  const [form,setForm] = useState({name:'',email:'',password:'',role:'student'})
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    try{
      await axios.post('http://localhost:5000/api/auth/signup', form)
      alert('Account created, login now')
      nav('/login')
    }catch(err){
      alert(err.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Sign up</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="w-full p-2 border rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <select className="w-full p-2 border rounded" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
        </select>
        <button className="w-full py-2 bg-green-600 text-white rounded">Create account</button>
      </form>
    </div>
  )
}