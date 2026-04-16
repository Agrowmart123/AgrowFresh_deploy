import React, { useRef, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { IMAGES } from '../data/images'

export const categories = [
  { id: 'fruits', title: 'Fruits', img:IMAGES.cat1, items: 15, bgColor: 'bg-green-100' },
  { id:'veg', title:'Vegetables', img:IMAGES.cat2, items: 12, bgColor: 'bg-yellow-100' },
  { id: 'local', title: 'Local Products', img:IMAGES.cat3, items: 8, bgColor: 'bg-purple-100' },
  { id: 'pulses', title: 'Pulses', img:IMAGES.cat4, items: 6, bgColor: 'bg-orange-100' },
  { id:'dairy', title:'Dairy', img:IMAGES.cat5, items: 10, bgColor: 'bg-pink-100' },
  { id:'meat', title:'Meat & Seafood', img:IMAGES.cat6, items: 7, bgColor: 'bg-red-100' },
  { id:'fert', title:'Fertilizers', img:IMAGES.cat7, items: 5, bgColor: 'bg-blue-100' },
  { id:'seeds', title:'Seeds', img:IMAGES.cat8, items: 9, bgColor: 'bg-green-100' },
]

const categoryTabs = []

export default function CategoryGrid({ layout = 'grid' }){
  const scrollerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (layout !== 'carousel') return
    const left = document.getElementById('cats-left')
    const right = document.getElementById('cats-right')
    const scroller = scrollerRef.current
    function leftClick(){ scroller?.scrollBy({left:-240, behavior:'smooth'}) }
    function rightClick(){ scroller?.scrollBy({left:240, behavior:'smooth'}) }
    left?.addEventListener('click', leftClick)
    right?.addEventListener('click', rightClick)
    return () =>{
      left?.removeEventListener('click', leftClick)
      right?.removeEventListener('click', rightClick)
    }
  }, [layout])

  if(layout === 'carousel'){
    return (
      <div className="w-full">
      

          <div ref={scrollerRef} className="flex gap-8 overflow-x-auto pb-2 scroll-smooth no-scrollbar px-4">
            {categories.map(c => (
              <div key={c.id} onClick={() => navigate(`/category/${c.id}`)} className="flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer group">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <img src={c.img} alt={c.title} className="w-24 h-24 object-cover" />
                </div>
                <p className="text-sm font-medium text-gray-800 text-center">{c.title}</p>
              </div>
            ))}
          </div>
        </div>
     
    )
  }

  return (
    <div className="flex gap-8 overflow-x-auto pb-2 scroll-smooth no-scrollbar px-4">
      {categories.map(c => (
        <div key={c.id} onClick={() => navigate(`/category/${c.id}`)} className="flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer group">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
            <img src={c.img} alt={c.title} className="w-24 h-24 object-cover" />
          </div>
          <p className="text-sm font-medium text-gray-800 text-center">{c.title}</p>
        </div>
      ))}
    </div>
  )
}
