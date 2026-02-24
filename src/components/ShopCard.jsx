import React from 'react'
import { Link } from 'react-router-dom'

import { IMAGES } from '../data/images'

export default function ShopCard({ shop }) {
  const img = shop.image || IMAGES.shop1 || IMAGES.shop2
  return (
    <Link to={`/shop/${shop.id}`} className="block bg-white rounded-lg shadow card hover:shadow-card-md p-3 hover:shadow-md">
      <div className="flex items-start gap-4">
        <img src={img} alt={shop.name} className="w-28 h-20 rounded object-cover flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{shop.name}</h3>
            <div className="text-sm text-gray-500">{shop.distance || '0.8 km'}</div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{shop.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">{shop.rating || 4.5} ★</span>
            {shop.offer && <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">{shop.offer}</span>}
            <span className="text-gray-400">{shop.deliveryTime} mins</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
