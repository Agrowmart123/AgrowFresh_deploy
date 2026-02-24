import axios from 'axios'

export const BASE_URL = process.env.VITE_API_BASE || 'YOUR_BACKEND_URL'

const api = axios.create({
  baseURL: BASE_URL,
})

export default api

// Mocked order API for demo/testing
export async function createOrder(orderPayload){
  // Simulate server delay
  await new Promise(r => setTimeout(r, 600))
  const id = 'ORD-' + Date.now()
  const order = { id, ...orderPayload, createdAt: new Date().toISOString() }

  // save to localStorage to emulate backend
  const existing = JSON.parse(localStorage.getItem('ag_orders') || '[]')
  existing.unshift(order)
  localStorage.setItem('ag_orders', JSON.stringify(existing))
  return order
}

export function getOrders(){
  return JSON.parse(localStorage.getItem('ag_orders') || '[]')
}

export function clearOrders(){
  localStorage.removeItem('ag_orders')
}
