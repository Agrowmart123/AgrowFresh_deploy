import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { createOrder } from '../services/api'

export default function Checkout(){
  const { cartItems, clearCart } = useCart()
  const { token } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pin, setPin] = useState('')
  const [payment, setPayment] = useState('cod')
  const [loading, setLoading] = useState(false)

  async function onPlace(e){
    e.preventDefault()
    if (!token){
      showToast('Please login to place order', 'info')
      navigate('/login')
      return
    }
    if (cartItems.length === 0){
      showToast('Cart is empty', 'error')
      return
    }
    if (!name || !address || !city || !pin){
      showToast('Please fill all address fields', 'error')
      return
    }
    // basic PIN validation
    if (!/^[0-9]{4,6}$/.test(pin)){
      showToast('Enter valid PIN code', 'error')
      return
    }

    setLoading(true)
    try{
      const orderPayload = {
        customer: { name, address, city, pin },
        items: cartItems,
        paymentMethod: payment,
        total: cartItems.reduce((s,p)=>s+p.price*p.quantity,0),
      }
      const order = await createOrder(orderPayload)
      clearCart()
      showToast('Order placed successfully', 'success')
      navigate('/orders')
    }catch(err){
      showToast('Failed to place order', 'error')
    }finally{setLoading(false)}
  }

  return (
    <div>
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold">Address</h3>
          <form onSubmit={onPlace} className="space-y-4 mt-3">
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full border p-3 rounded-xl" placeholder="Full name" />
            <input value={address} onChange={e=>setAddress(e.target.value)} className="w-full border p-3 rounded-xl" placeholder="Address line" />
            <div className="flex gap-3">
              <input value={city} onChange={e=>setCity(e.target.value)} className="flex-1 border p-3 rounded-xl" placeholder="City" />
              <input value={pin} onChange={e=>setPin(e.target.value)} className="w-28 border p-3 rounded-xl" placeholder="PIN" />
            </div>
            <h3 className="font-semibold mt-2">Payment</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2"><input type="radio" name="pay" value="cod" checked={payment==='cod'} onChange={e=>setPayment(e.target.value)}/> Cash on Delivery</label>
              <label className="flex items-center gap-2"><input type="radio" name="pay" value="online" checked={payment==='online'} onChange={e=>setPayment(e.target.value)} /> UPI / Card</label>
            </div>
            <button disabled={loading} className="mt-4 grad-primary px-4 py-2 rounded-full text-white shadow">{loading ? 'Placing...' : 'Place Order'}</button>
          </form>
        </div>
      </main>
    </div>
  )
}
