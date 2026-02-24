import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Signup(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  function onSubmit(e){
    e.preventDefault()
    // demo signup: set token and user
    login({ name, email }, 'demo-token')
    navigate('/')
  }

  return (
    <div>
      <main className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Signup</h1>
            <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 space-y-4 shadow-lg">
              <input value={name} onChange={e=>setName(e.target.value)} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-purple-500" placeholder="Name" />
              <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-purple-500" placeholder="Email" />
              <input value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-purple-500" placeholder="Password" type="password" />
              <button className="w-full grad-primary py-3 rounded-full text-white shadow-lg hover:scale-105 transition">Sign Up</button>
            </form>
      </main>
    </div>
  )
}
