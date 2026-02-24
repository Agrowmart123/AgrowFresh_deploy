import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="mt-12 bg-gradient-to-r from-[#5b21b6] to-[#6C2BD9] text-white py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-bold text-xl">Agrowfresh</h4>
          <p className="text-sm text-purple-200 mt-2">Fresh groceries & farm supplies, delivered fast and responsibly.</p>
        </div>
        <div>
          <h5 className="font-semibold text-purple-100">Shop</h5>
          <ul className="text-sm text-purple-200 mt-2 space-y-1">
            <li><Link to="/category/Vegetables" className="hover:underline">Vegetables</Link></li>
            <li><Link to="/category/Dairy" className="hover:underline">Dairy</Link></li>
            <li><Link to="/category/Seeds" className="hover:underline">Seeds</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-purple-100">Company</h5>
          <ul className="text-sm text-purple-200 mt-2 space-y-1">
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/careers" className="hover:underline">Careers</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-purple-100">Account</h5>
          <ul className="text-sm text-purple-200 mt-2 space-y-1">
            <li><Link to="/account" className="hover:underline">Account</Link></li>
            <li><Link to="/orders" className="hover:underline">Orders</Link></li>
            <li><Link to="/help" className="hover:underline">Help</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-6 text-sm text-purple-100 text-center">© Agfresh — Demo marketplace</div>
    </footer>
  )
}
