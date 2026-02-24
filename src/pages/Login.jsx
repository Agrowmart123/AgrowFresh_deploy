import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function onSubmit(e){
    e.preventDefault()
    // demo login: set dummy token and user
    login({ name: email.split('@')[0] || 'User', email }, 'demo-token')
    const dest = location.state?.from || '/'
    navigate(dest)
  }

  return (
    <div>
      <main className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={onSubmit} className="bg-white p-4 rounded space-y-2">
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2 rounded" placeholder="Email" />
          <input value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-2 rounded" placeholder="Password" type="password" />
          <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
        </form>
      </main>
    </div>
  )
}
