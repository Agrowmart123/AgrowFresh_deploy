import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useLocation } from '../context/LocationContext'
import LocationPicker from './LocationPicker'

export default function Navbar() {
  const { cartItems } = useCart()
  const { token, user } = useAuth()
  const { location } = useLocation()
  const navigate = useNavigate()
  const count = cartItems.reduce((s, i) => s + i.quantity, 0)
  const [locOpen, setLocOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: brand + location */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 4, repeat: Infinity }} className="w-10 h-10 grad-primary rounded-full flex items-center justify-center text-white font-bold shadow-lg">AF</motion.div>
            <div className="hidden sm:block">
              <div className="text-lg font-semibold tracking-tight text-gray-900">Agrowfresh</div>
              <div className="text-xs text-gray-500">Fresh from farms</div>
            </div>
          </Link>

          <button onClick={() => setLocOpen(true)} className="hidden md:flex items-center gap-2 bg-white border rounded-full px-3 py-1 shadow-sm hover:shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z"/></svg>
            <span className="text-sm text-gray-700">{location?.name || 'Select location'}</span>
          </button>
        </div>

        {/* Center: search */}
          <div className="flex-1 px-4">
          <div className="hidden md:flex items-center bg-white/80 border border-gray-100 rounded-full shadow-sm px-4 py-2 max-w-2xl mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1016.65 16.65z"/></svg>
            <input placeholder="Search for products or shops" className="flex-1 px-3 outline-none text-sm" />
            <button className="ml-2 grad-primary text-white px-4 py-1 rounded-full text-sm hover:scale-105 transform transition-shadow duration-300 shadow-sm hover:shadow-lg">Search</button>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/shops" className="nav-link text-sm px-3 py-2 rounded-full hover:bg-pink-50 text-pink-600 font-medium">Shops</Link>
            <Link to="/account" className="nav-link text-sm px-3 py-2 rounded-full hover:bg-gray-100">{token ? `Hi, ${user?.name?.split(' ')[0] || 'You'}` : 'Account'}</Link>
            <button onClick={() => navigate('/orders')} className="nav-link text-sm px-3 py-2 rounded-full hover:bg-gray-100">Orders</button>
            <Link to="/cart" className="relative nav-link text-sm px-3 py-2 rounded-full hover:bg-gray-100">
              Cart
              {count > 0 && <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{count}</span>}
            </Link>

            {token ? (
              <Link to="/account" className="text-sm px-3 py-2 rounded-full">Profile</Link>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('/login')} className="text-sm px-3 py-2 rounded-full grad-primary shadow">Login</button>
                <button onClick={() => navigate('/signup')} className="text-sm px-3 py-2 rounded-full border">Sign up</button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(s => !s)} aria-expanded={menuOpen} aria-label="Toggle menu" className="p-2 rounded-md bg-white border shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className={`md:hidden ${menuOpen ? 'block' : 'hidden'} bg-white/95 border-t shadow-sm`}>
        <div className="p-3 flex flex-col gap-2">
          <button onClick={() => { setLocOpen(true); setMenuOpen(false) }} className="text-left px-3 py-2 rounded hover:bg-gray-50">Location: {location?.name || 'Select'}</button>
          <Link to="/shops" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-50">Shops</Link>
          <Link to="/account" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-50">Account</Link>
          <button onClick={() => { navigate('/orders'); setMenuOpen(false) }} className="text-left px-3 py-2 rounded hover:bg-gray-50">Orders</button>
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-50">Cart ({count})</Link>
          {!token && (
            <div className="flex gap-2">
              <button onClick={() => { navigate('/login'); setMenuOpen(false) }} className="flex-1 px-3 py-2 rounded grad-primary text-white">Login</button>
              <button onClick={() => { navigate('/signup'); setMenuOpen(false) }} className="flex-1 px-3 py-2 rounded border">Sign up</button>
            </div>
          )}
        </div>
      </motion.div>

      <LocationPicker open={locOpen} onClose={() => setLocOpen(false)} />
    </header>
  )
}
