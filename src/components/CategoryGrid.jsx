import React from 'react'

import { IMAGES } from '../data/images'

const categories = [
  { id:'veg', title:'Vegetables', img:IMAGES.product1 },
  { id:'meat', title:'Meat', img:IMAGES.product2 },
  { id:'dairy', title:'Dairy', img:IMAGES.product3 },
  { id:'seeds', title:'Seeds', img:IMAGES.product1 },
  { id:'tools', title:'Tools', img:IMAGES.shop1 },
  { id:'fert', title:'Fertilizers', img:IMAGES.fertilizer },
]

export default function CategoryGrid(){
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {categories.map(c => (
        <div key={c.id} className="bg-white rounded-2xl p-4 text-center hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
            <img src={c.img} alt={c.title} className="w-14 h-14 object-cover" />
          </div>
          <div className="mt-3 font-semibold text-sm text-gray-800">{c.title}</div>
        </div>
      ))}
    </div>
  )
}
