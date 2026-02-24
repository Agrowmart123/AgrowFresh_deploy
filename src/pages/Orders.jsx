import React from 'react'
import { getOrders } from '../services/api'

export default function Orders(){
  const orders = getOrders()
  return (
    <div>
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        {orders.length === 0 ? (
          <div className="text-gray-600">No orders yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Order {o.id}</div>
                    <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="font-bold">₹{o.total}</div>
                </div>
                <div className="mt-2 text-sm">
                  {o.items.map(it => (
                    <div key={it.id} className="flex items-center justify-between py-1">
                      <div>{it.title} × {it.quantity}</div>
                      <div>₹{it.price * it.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
