import React from 'react'
import { IMAGES } from '../data/images'
import { motion } from 'framer-motion'

export default function Carousel({ items = [] }) {
  const slides = items.length ? items : [IMAGES.banner]
  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <div className="flex gap-4 snap-x snap-mandatory overflow-x-auto scroll-smooth py-2 no-scrollbar">
        {slides.map((s, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }} className="flex-shrink-0 w-full md:w-3/4 lg:w-2/3 snap-start px-2">
            <div className="h-56 md:h-72 rounded-2xl overflow-hidden shadow-lg group">
              <img src={s} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={`slide-${i}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
