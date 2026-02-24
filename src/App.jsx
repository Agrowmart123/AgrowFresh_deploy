import React from 'react'
import { Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-3xl p-6 text-center">
        <h1 className="text-3xl font-bold">Agrowfresh</h1>
        <p className="text-gray-600 mt-2">Open the app routes: <Link to="/" className="text-blue-600">Home</Link></p>
      </div>
    </div>
  )
}
