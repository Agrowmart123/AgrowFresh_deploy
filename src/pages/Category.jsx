import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import ShopCard from '../components/ShopCard'
import { IMAGES } from '../data/images'

export default function Category() {
  const { categoryName } = useParams()
  const [sort, setSort] = useState('relevance')
  const [filterOffer, setFilterOffer] = useState(false)

  // sample data - replace with API fetch
  const shops = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({ id: `c${i}`, name: `${categoryName} Shop ${i+1}`, description: 'Shop description and specialties', rating: (4.0 + (i%5)*0.1).toFixed(1), deliveryTime: 20 + i, image: [IMAGES.shop1, IMAGES.shop2, IMAGES.shop3][i%3], offer: i%2===0 ? '10% OFF' : null, distance: `${0.5 + i*0.3} km` })), [categoryName])

  const visible = shops.filter(s => (filterOffer ? s.offer : true))
  if (sort === 'time') visible.sort((a,b) => a.deliveryTime - b.deliveryTime)
  if (sort === 'rating') visible.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating))

  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Category: {categoryName}</h1>
        <div className="flex items-center gap-3">
          <select value={sort} onChange={e=>setSort(e.target.value)} className="border rounded px-2 py-1">
            <option value="relevance">Relevance</option>
            <option value="time">Delivery time</option>
            <option value="rating">Top rated</option>
          </select>
          <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={filterOffer} onChange={e=>setFilterOffer(e.target.checked)} /> Offers only</label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="hidden md:block">
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-3">Filters</h4>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" /> Open now</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Offers</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Fast delivery</label>
            </div>
          </div>
        </aside>

        <section className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visible.map(s => <ShopCard key={s.id} shop={s} />)}
          </div>
        </section>
      </div>
    </main>
  )
}
