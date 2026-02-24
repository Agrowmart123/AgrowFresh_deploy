import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }){
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}
