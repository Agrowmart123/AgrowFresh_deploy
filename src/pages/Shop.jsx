import React from 'react'
import { useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import ConflictModal from '../components/ConflictModal'
import { IMAGES } from '../data/images'

export default function Shop() {
  const { shopId } = useParams()
  // sample shop data (replace with real API fetch when available)
  const shop = React.useMemo(() => ({
    id: shopId,
    name: `Meat Shop ${shopId}`,
    banner: IMAGES.banner,
    image: IMAGES.shop1,
    locality: 'karve nagar pune',
    address: 'Shop 12, Market Road, karve nagar, pune',
    rating: 4.6,
    minOrder: 100,
    deliveryTime: '30 mins',
    open: true,
    highlights: ['Fresh meat daily', 'Home delivery', 'Hygienic packing'],
  }), [shopId])

  const products = React.useMemo(() => Array.from({ length: 12 }).map((_, i) => ({ id: `${shopId}-p${i}`, name: `${i%2===0? 'Chicken' : 'Mutton'} Cut ${i+1}`, price: 80 + i * 10, shopId, image: [IMAGES.product1, IMAGES.product2, IMAGES.product3][i%3], category: i%4===0 ? 'Specials' : (i%3===0? 'Whole Cuts' : 'Portions') })), [shopId])
  const { cartItems } = useCart()

  return (
    <div>
      <main className="max-w-6xl mx-auto p-4">
        <div className="rounded-2xl mb-4 overflow-hidden shadow-lg">
          <img src={shop.banner} alt="shop banner" className="w-full h-56 object-cover" />
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2">
            <div className="flex items-start gap-4">
              <img src={shop.image} alt={shop.name} className="w-28 h-28 rounded-2xl object-cover border" />
              <div>
                <h1 className="text-2xl font-bold">{shop.name}</h1>
                <div className="text-sm text-gray-600">{shop.locality}</div>
                <div className="mt-2 text-sm text-gray-700">{shop.open ? 'Open now' : 'Closed'} • Min order ₹{shop.minOrder} • {shop.rating} ★</div>
                <div className="mt-3 flex gap-3">
                  <button className="px-3 py-2 grad-primary text-white rounded-full shadow">View Menu</button>
                  <button className="px-3 py-2 bg-white border rounded-xl">Call Shop</button>
                  <button className="px-3 py-2 bg-white border rounded-xl">Directions</button>
                </div>
                <div className="mt-3 text-sm text-gray-600">{shop.address}</div>
                <div className="mt-3 flex gap-2">
                  {shop.highlights.map(h => <span key={h} className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs shadow-sm">{h}</span>)}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Products</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </div>

          <aside className="bg-white rounded-2xl p-4 shadow-lg">
            <h4 className="font-semibold">Shop Info</h4>
            <div className="text-sm text-gray-600 mt-2">Rating <strong className="text-gray-800">{shop.rating}</strong></div>
            <div className="text-sm text-gray-600">Delivery time <strong className="text-gray-800">{shop.deliveryTime}</strong></div>
            <div className="text-sm text-gray-600">Min order <strong className="text-gray-800">₹{shop.minOrder}</strong></div>
            <div className="mt-4">
              <h5 className="font-semibold">About</h5>
              <p className="text-sm text-gray-600 mt-1">Family-run poultry shop serving fresh cuts and hygienic packing since 1998. We deliver across nearby localities.</p>
            </div>
          </aside>
        </div>
      </main>

      <ConflictModal />

      {/* sticky cart bar */}
        {cartItems.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-2xl px-5 py-3 flex items-center gap-4 z-30">
          <div className="text-sm text-gray-600">{cartItems.length} items</div>
          <div className="font-bold">₹{cartItems.reduce((s,i)=>s+i.price*i.quantity,0)}</div>
          <a href="/cart" className="px-4 py-2 grad-primary text-white rounded-full shadow">View Cart</a>
        </div>
      )}
    </div>
  )
}
