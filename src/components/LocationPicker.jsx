import React, { useState } from 'react'
import { useLocation } from '../context/LocationContext'

const SAMPLE = [
  { name: 'Bengaluru, KA', pin: '560001' },
  { name: 'Mumbai, MH', pin: '400001' },
  { name: 'Delhi, DL', pin: '110001' },
  { name: 'Kolkata, WB', pin: '700001' }
]

export default function LocationPicker({ open, onClose }){
  const { location, setLocation } = useLocation()
  const [pin, setPin] = useState(location?.pin || '')
  const [name, setName] = useState(location?.name || '')

  if (!open) return null

  function choose(loc){
    setLocation(loc)
    onClose()
  }

  function save(){
    if (!name && !pin) return
    setLocation({ name: name || `PIN ${pin}`, pin })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-orange-500 rounded-t-md -mt-6 mb-4"></div>
        <h3 className="text-lg font-semibold">Select your location</h3>
        <div className="mt-3 space-y-2">
          {SAMPLE.map(s => (
            <button key={s.pin} onClick={() => choose(s)} className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100">{s.name} • {s.pin}</button>
          ))}
        </div>
        <div className="mt-4">
          <div className="text-sm text-gray-600">Or enter PIN / place</div>
          <input value={pin} onChange={e=>setPin(e.target.value)} placeholder="PIN code" className="w-full border p-3 rounded-lg mt-2 focus:ring-2 focus:ring-purple-500" />
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Place name (optional)" className="w-full border p-3 rounded-lg mt-2 focus:ring-2 focus:ring-purple-500" />
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-2 border rounded-lg">Cancel</button>
            <button onClick={save} className="px-3 py-2 grad-primary text-white rounded-lg">Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
