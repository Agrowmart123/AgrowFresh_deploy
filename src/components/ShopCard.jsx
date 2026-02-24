import React from 'react'
import { Link } from 'react-router-dom'
import { IMAGES } from '../data/images'
import { motion } from 'framer-motion'

export default function ShopCard({ shop }) {
  const img = shop.image || IMAGES.shop1 || IMAGES.shop2
  return (
    <Link to={`/shop/${shop.id}`} className="block group">
      <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1">
        <div className="h-1 bg-gradient-to-r from-purple-600 via-orange-500 to-yellow-400"></div>
        <motion.div whileHover={{ scale: 1.01 }} className="p-4 flex items-start gap-4">
          <div className="w-28 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
            <img src={img} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-gray-900">{shop.name}</h3>
              <div className="text-sm text-gray-500">{shop.distance || '0.8 km'}</div>
            </div>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{shop.description}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-600">
              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">{shop.rating || 4.5} ★</span>
              {shop.offer && <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">{shop.offer}</span>}
              <span className="text-gray-400">{shop.deliveryTime} mins</span>
            </div>
          </div>
        </motion.div>
      </div>
    </Link>
  )
}
