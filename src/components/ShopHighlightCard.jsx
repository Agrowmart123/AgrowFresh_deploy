import React from 'react'
import { IMAGES } from '../data/images'
import { Link } from 'react-router-dom'
import { useToast } from '../context/ToastContext'

export default function ShopHighlightCard({ shop }) {
  const img = shop.image || IMAGES.shop1
  const { showToast } = useToast()

  function handleShare(e){
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/shop/${shop.id}`
    if(navigator.share){
      navigator.share({ title: shop.name, url }).catch(()=>{})
    } else if(navigator.clipboard){
      navigator.clipboard.writeText(url).then(()=> showToast('Shop link copied to clipboard','success'))
    } else {
      showToast('Share not supported in this browser','info')
    }
  }

  return (
    <Link to={`/shop/${shop.id}`} className="w-80 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col focus:outline-none focus:ring-2 focus:ring-pink-300" aria-label={`Open ${shop.name}`}>
      <div className="flex gap-4 p-4 items-start">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border">
          <img src={img} alt={shop.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-base leading-tight">{shop.name}</h4>
            <button onClick={handleShare} onKeyDown={(e)=>e.stopPropagation()} className="p-2 rounded-full bg-pink-50 text-pink-600 text-sm" aria-label="Share shop">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 8a3 3 0 10-6 0 3 3 0 006 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-1">{shop.category || 'Fruits & Vegetables'} Shops</div>
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-700">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">Best Rated</span>
            <span className="font-medium">{shop.rating || '4.8'}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{shop.deliveryTime || '2 hrs'}</span>
          </div>
          <div className="text-sm text-gray-500 mt-2">{shop.distance || '0.60 Kms'} • {shop.locality || 'Umerkhadi'}</div>
        </div>
      </div>

      <div className="mt-auto bg-yellow-300 text-yellow-900 text-sm font-medium px-4 py-3 flex items-center justify-center">⚑ Exciting Offers Inside</div>
    </Link>
  )
}
