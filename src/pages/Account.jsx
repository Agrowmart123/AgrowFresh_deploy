import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Account(){
  const { user, logout } = useAuth()
  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Account</h1>
      {user ? (
        <div className="bg-white p-4 rounded">
          <div className="font-semibold">Name: {user.name}</div>
          <div className="text-sm text-gray-600">Email: {user.email}</div>
          <button onClick={logout} className="mt-4 px-3 py-2 bg-red-600 text-white rounded">Logout</button>
        </div>
      ) : (
        <div className="text-gray-600">You are not logged in.</div>
      )}
    </main>
  )
}
