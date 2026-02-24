import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [shopId, setShopId] = useState(null)
  const [showConflictModal, setShowConflictModal] = useState(false)
  const [pendingItem, setPendingItem] = useState(null)

  function addToCart(item) {
    // item must include shopId
    if (shopId && item.shopId !== shopId) {
      setPendingItem(item)
      setShowConflictModal(true)
      return false
    }

    setShopId(item.shopId)
    setCartItems(prev => {
      const existing = prev.find(ci => ci.id === item.id)
      if (existing) {
        return prev.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + (item.quantity || 1) } : ci)
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
    return true
  }

  function removeFromCart(productId) {
    setCartItems(prev => {
      const next = prev.filter(p => p.id !== productId)
      if (next.length === 0) setShopId(null)
      return next
    })
  }

  function clearCart() {
    setCartItems([])
    setShopId(null)
    setPendingItem(null)
    setShowConflictModal(false)
  }

  function confirmClearAndAdd() {
    if (!pendingItem) return
    clearCart()
    addToCart(pendingItem)
    setPendingItem(null)
    setShowConflictModal(false)
  }

  function updateQuantity(productId, quantity) {
    setCartItems(prev => prev.map(p => p.id === productId ? { ...p, quantity } : p))
  }

  const value = {
    cartItems,
    shopId,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    showConflictModal,
    setShowConflictModal,
    confirmClearAndAdd,
    pendingItem,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
