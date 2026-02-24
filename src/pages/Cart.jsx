import React from 'react'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart()
  const subtotal = cartItems.reduce((s, p) => s + p.price * p.quantity, 0)
  const delivery = cartItems.length ? 30 : 0
  const taxes = +(subtotal * 0.05).toFixed(2)
  const total = subtotal + delivery + taxes

  return (
    <div>
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-gray-600">Cart is empty</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded mb-2">
                  <div className="flex-1">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-gray-500">₹{item.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2 py-1 border">-</button>
                    <div>{item.quantity}</div>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 border">+</button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-600">Remove</button>
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="mt-2 text-sm text-red-600">Clear Cart</button>
            </div>

            <aside className="bg-white p-4 rounded">
              <h3 className="font-semibold mb-2">Price Details</h3>
              <div className="flex justify-between"> <span>Subtotal</span> <span>₹{subtotal}</span></div>
              <div className="flex justify-between"> <span>Delivery Fee</span> <span>₹{delivery}</span></div>
              <div className="flex justify-between"> <span>Taxes</span> <span>₹{taxes}</span></div>
              <div className="flex justify-between font-bold mt-2"> <span>Total</span> <span>₹{total}</span></div>
              <a href="/checkout" className="block mt-4 text-center bg-green-600 text-white px-4 py-2 rounded">Proceed to Checkout</a>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
