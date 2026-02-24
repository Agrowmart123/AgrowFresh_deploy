import React, { useState } from 'react'
import { motion } from 'framer-motion'
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
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.35 }} className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl p-4 group">
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-white cursor-pointer" onClick={() => setOpen(true)}>
        {!imgLoaded && <Skeleton className="h-44 w-full" />}
        <motion.img src={imgSrc} alt={product.name} onLoad={() => setImgLoaded(true)} initial={{ opacity: 0, scale: 0.98 }} animate={imgLoaded ? { opacity: 1, scale: 1 } : {}} className={`w-full h-44 object-contain p-4 bg-white group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? '' : 'hidden'}`} />

        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">{discount}% OFF</div>
        )}
      </div>

      <div className="mt-3">
        <h4 className="font-semibold text-sm leading-snug line-clamp-2">{product.name}</h4>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-purple-600 font-bold text-lg">₹{product.price}</div>
            {product.mrp && <div className="text-xs text-gray-400 line-through">₹{product.mrp}</div>}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <select value={qty} onChange={(e) => setQty(e.target.value)} className="text-xs border rounded px-3 py-1 w-24 bg-white">
                {product.sizes ? product.sizes.map(s => <option key={s} value={s}>{s}</option>) : <option value={qty}>{qty}</option>}
              </select>
            </div>
            <button onClick={() => onAdd(product)} className="w-24 text-sm px-3 py-1 rounded-full grad-primary text-white font-semibold hover:shadow-xl active:scale-95 transition-transform">ADD</button>
          </div>
        </div>
      </div>

      <ProductModal open={open} product={product} onClose={() => setOpen(false)} onAdd={onAdd} />
    </motion.div>
  )
}
