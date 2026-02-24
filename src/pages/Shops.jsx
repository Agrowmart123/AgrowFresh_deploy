import React from 'react'
import { IMAGES } from '../data/images'
import ShopHighlightCard from '../components/ShopHighlightCard'
import ShopCard from '../components/ShopCard'

const sampleShops = [
  { id: 's1', name: 'Umar Fruits Shop', image: IMAGES.shop1, category: 'Fruits & Vegetables', rating: 4.8, deliveryTime: '2 hrs', distance: '0.60 Kms', locality: 'Umerkhadi', description: 'Fresh fruits and vegetables daily', offer: '10% off' },
  { id: 's2', name: 'Naved Chicken Center', image: IMAGES.shop2, category: 'Meat & Fish', rating: 4.9, deliveryTime: '2 hrs', distance: '0.48 Kms', locality: 'undefinedundefined', description: 'Quality chicken cuts', offer: 'Free delivery' },
  { id: 's3', name: 'Green Veggies', image: IMAGES.shop3, category: 'Fruits & Vegetables', rating: 4.7, deliveryTime: '1.5 hrs', distance: '0.75 Kms', locality: 'Market Road', description: 'Locally sourced produce' },
  { id: 's4', name: 'Ocean Catch', image: IMAGES.shop2, category: 'Meat & Fish', rating: 4.6, deliveryTime: '3 hrs', distance: '1.2 Kms', locality: 'Harbour', description: 'Fresh fish daily' },
]

export default function Shops(){
  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar categories */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3 p-3 rounded bg-pink-50">
              <img src={IMAGES.shop1} alt="all shops" className="w-12 h-12 rounded object-cover" />
              <div className="font-semibold text-pink-600">All Shops</div>
            </div>

            <div className="mt-4 space-y-3">
              <button className="w-full flex items-center gap-3 bg-white rounded p-3 shadow-sm">
                <img src={IMAGES.product1} className="w-10 h-10 rounded" alt="veg" />
                <span>Fruits & Vegetables</span>
              </button>
              <button className="w-full flex items-center gap-3 bg-white rounded p-3 shadow-sm">
                <img src={IMAGES.shop2} className="w-10 h-10 rounded" alt="meat" />
                <span>Meat & Fish</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Right content */}
        <section className="md:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Browse Shops Near You</h2>

          <div className="flex gap-4 overflow-x-auto pb-2 mb-6">
            {sampleShops.slice(0,3).map(s => (
              <ShopHighlightCard key={s.id} shop={s} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleShops.map(s => <ShopCard key={s.id} shop={s} />)}
          </div>
        </section>
      </div>
    </main>
  )
}
