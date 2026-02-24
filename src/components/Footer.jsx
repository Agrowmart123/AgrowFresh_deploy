import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="mt-12 bg-white py-8 border-t">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-bold">Agrowfresh</h4>
          <p className="text-sm text-gray-500 mt-2">Fresh groceries & agriculture supplies, delivered fast.</p>
        </div>
        <div>
          <h5 className="font-semibold">Shop</h5>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li><Link to="/category/Vegetables" className="hover:underline">Vegetables</Link></li>
            <li><Link to="/category/Dairy" className="hover:underline">Dairy</Link></li>
            <li><Link to="/category/Seeds" className="hover:underline">Seeds</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold">Company</h5>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/careers" className="hover:underline">Careers</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold">Account</h5>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li><Link to="/account" className="hover:underline">Account</Link></li>
            <li><Link to="/orders" className="hover:underline">Orders</Link></li>
            <li><Link to="/help" className="hover:underline">Help</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-6 text-sm text-gray-500 text-center">© Agfresh — Demo marketplace • Colors: green, yellow, orange, purple</div>
    </footer>
  )
}
