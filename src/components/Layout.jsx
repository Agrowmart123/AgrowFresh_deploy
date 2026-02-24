import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }){
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_left,_var(--color-purple)_0%,_transparent_20%),_radial-gradient(ellipse_at_bottom_right,_#FACC15_0%,_transparent_12%)]">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
