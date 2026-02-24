import React, { useRef, useEffect } from 'react'
import ShopCard from '../components/ShopCard'
import HeroBanner from '../components/HeroBanner'
import CategoryGrid from '../components/CategoryGrid'
import { IMAGES } from '../data/images'
import ShopHighlightCard from '../components/ShopHighlightCard'

const sampleShops = [
  { id: 's1', name: 'Green Grocery', description: 'Fresh vegetables', rating: 4.5, deliveryTime: 30, image: IMAGES.shop1, offer: '10% OFF', distance: '0.8 km' },
  { id: 's2', name: 'Dairy Delight', description: 'Milk & dairy', rating: 4.2, deliveryTime: 25, image: IMAGES.shop2, offer: 'Free delivery', distance: '1.2 km' },
  { id: 's3', name: 'Farm Tools', description: 'Tools for agriculture', rating: 4.6, deliveryTime: 40, image: IMAGES.shop3, offer: 'Save ₹50', distance: '0.6 km' },
]

export default function Home() {
  const scrollerRef = useRef(null)

  useEffect(()=>{
    const left = document.getElementById('discover-left')
    const right = document.getElementById('discover-right')
    const scroller = document.getElementById('discover-scroller')
    if(!scroller) return
    function leftClick(){ scroller.scrollBy({left:-320, behavior:'smooth'}) }
    function rightClick(){ scroller.scrollBy({left:320, behavior:'smooth'}) }
    left?.addEventListener('click', leftClick)
    right?.addEventListener('click', rightClick)
    return ()=>{ left?.removeEventListener('click', leftClick); right?.removeEventListener('click', rightClick) }
  }, [])

  return (
    <div>
      <main className="max-w-6xl mx-auto p-4">
        <HeroBanner />

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Discover Shops Near You</h2>
            <a href="#" className="text-sm text-pink-600">See All ›</a>
          </div>

          <div className="relative">
            <button aria-label="Scroll left" className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full shadow hidden md:block" id="discover-left">‹</button>
            <button aria-label="Scroll right" className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full shadow hidden md:block" id="discover-right">›</button>

            <div ref={(el)=>{window.__discoverEl = el}} tabIndex={0} onKeyDown={(e)=>{
              if(e.key === 'ArrowLeft') window.__discoverEl?.scrollBy({left:-320, behavior:'smooth'})
              if(e.key === 'ArrowRight') window.__discoverEl?.scrollBy({left:320, behavior:'smooth'})
            }} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar" id="discover-scroller">
              {sampleShops.concat(sampleShops).map((s,i) => (
                <div key={s.id + '-' + i} className="flex-shrink-0">
                  <ShopHighlightCard shop={{...s, image: [IMAGES.product1, IMAGES.product2, IMAGES.product3][i%3], rating: s.rating, deliveryTime: '2 hrs', distance: s.distance, locality: 'Umerkhadi'}} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
          <CategoryGrid />
        </section>

   

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Popular Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({length:8}).map((_,i) => (
              <div key={i} className="bg-white rounded shadow p-3">
                <img src={[IMAGES.product1,IMAGES.product2,IMAGES.product3][i%3]} alt="prod" className="w-full h-36 object-cover rounded" />
                <div className="mt-2 font-semibold">Product {i+1}</div>
                <div className="text-sm text-gray-600">₹{50 + i*10}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="mt-12" />
    </div>
  )
}
