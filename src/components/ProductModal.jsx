import React from 'react'
import { IMAGES } from '../data/images'

export default function ProductModal({ open, product, onClose, onAdd }){
  if(!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded max-w-2xl w-full p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold">{product?.name}</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <img src={product?.image || IMAGES.product1} alt={product?.name} className="w-full h-48 object-cover rounded" />
          <div className="md:col-span-2">
            <p className="text-gray-600">{product?.description || 'No description'}</p>
            <div className="mt-4 font-bold text-lg">₹{product?.price}</div>
            <div className="mt-4">
              <button onClick={() => onAdd && onAdd(product)} className="btn-primary px-4 py-2 rounded">Add to cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
