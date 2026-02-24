import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import ProductModal from './ProductModal'
import Skeleton from './Skeleton'
import { IMAGES } from '../data/images'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { token } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  function onAdd(item) {
    if (!token) {
      showToast('Please register or login to add items to cart', 'info')
      navigate('/signup')
      return
    }
    addToCart({ id: item.id, title: item.name, price: item.price, shopId: item.shopId })
    showToast('Added to cart', 'success')
    setOpen(false)
  }

  const fallbacks = [IMAGES.product1, IMAGES.product2, IMAGES.product3]
  const fallbacksAll = [IMAGES.product1, IMAGES.product2, IMAGES.product3, IMAGES.product4, IMAGES.product5]
  const imgSrc = product.image || fallbacksAll[Math.abs((product.id || '').toString().length) % fallbacksAll.length]

  const [qty, setQty] = useState(product.defaultQty || product.unit || '1 Unit')
  const discount = product.mrp ? Math.round((1 - (product.price || 0) / product.mrp) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5 p-3">
      <div className="relative w-full h-44 rounded-lg overflow-hidden bg-white cursor-pointer" onClick={() => setOpen(true)}>
        {!imgLoaded && <Skeleton className="h-44 w-full" />}
        <img src={imgSrc} alt={product.name} onLoad={() => setImgLoaded(true)} className={`w-full h-44 object-contain p-4 bg-white ${imgLoaded ? '' : 'hidden'}`} />

        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">{discount}% OFF</div>
        )}
      </div>

      <div className="mt-3">
        <h4 className="font-semibold text-sm leading-snug line-clamp-2">{product.name}</h4>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <div className="text-pink-600 font-bold text-lg">₹{product.price}</div>
            {product.mrp && <div className="text-xs text-gray-400 line-through">₹{product.mrp}</div>}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <select value={qty} onChange={(e) => setQty(e.target.value)} className="text-xs border rounded px-3 py-1 w-24 bg-white">
                {product.sizes ? product.sizes.map(s => <option key={s} value={s}>{s}</option>) : <option value={qty}>{qty}</option>}
              </select>
            </div>
            <button onClick={() => onAdd(product)} className="w-24 text-sm px-3 py-1 rounded-full border-2 border-pink-500 text-pink-600 font-semibold hover:bg-pink-50">ADD</button>
          </div>
        </div>
      </div>

      <ProductModal open={open} product={product} onClose={() => setOpen(false)} onAdd={onAdd} />
    </div>
  )
}
