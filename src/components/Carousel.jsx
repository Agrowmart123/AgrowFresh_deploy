import React from 'react'
import { IMAGES } from '../data/images'

export default function Carousel({ items = [] }) {
  const slides = items.length ? items : [IMAGES.banner]
  return (
    <div className="w-full overflow-hidden rounded-lg">
      <div className="flex gap-4 snap-x snap-mandatory overflow-x-auto scroll-smooth py-2">
        {slides.map((s, i) => (
          <div key={i} className="flex-shrink-0 w-full md:w-3/4 lg:w-2/3 snap-start">
            <div className="h-48 md:h-64 rounded overflow-hidden shadow-md">
              <img src={s} className="w-full h-full object-cover" alt={`slide-${i}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
