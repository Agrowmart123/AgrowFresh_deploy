import React from 'react'
import { useCart } from '../context/CartContext'

export default function ConflictModal() {
  const { showConflictModal, setShowConflictModal, clearCart, confirmClearAndAdd } = useCart()
  if (!showConflictModal) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg">
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-orange-500 rounded-t-md -mt-6 mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900">Cart contains items from another shop</h3>
        <p className="text-sm text-gray-600 mt-2">Your cart contains items from another shop. Clear cart to continue.</p>
        <div className="mt-4 flex gap-3 justify-end">
          <button onClick={() => setShowConflictModal(false)} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={confirmClearAndAdd} className="px-3 py-1 grad-primary text-white rounded">Clear & Continue</button>
        </div>
      </div>
    </div>
  )
}
