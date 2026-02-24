import React from 'react'
import { IMAGES } from '../data/images'
import Carousel from './Carousel'

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-lg text-black p-6 md:p-12 mb-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold">Groceries from your local kirana</h1>
          <p className="text-gray-700 mt-2">Fast delivery from trusted neighbourhood shops — support local businesses.</p>

          <div className="mt-6 flex gap-3">
            <input className="w-full md:w-96 rounded p-3" placeholder="Search for products or shops" />
            <button className="btn-primary px-4 py-3 rounded font-semibold">Search</button>
          </div>

          <div className="mt-6 flex gap-3 text-sm">
            <span className="bg-green-50 text-green-800 px-3 py-1 rounded">Free delivery over ₹499</span>
            <span className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded">Live tracking</span>
            <span className="bg-purple-50 text-purple-800 px-3 py-1 rounded">Support local</span>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <img src={IMAGES.shop3} alt="hero shop" className="w-full h-44 object-cover rounded shadow" />
        </div>
      </div>

    </section>
  )
}

