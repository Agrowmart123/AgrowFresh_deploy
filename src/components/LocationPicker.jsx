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
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold">Select your location</h3>
        <div className="mt-3 space-y-2">
          {SAMPLE.map(s => (
            <button key={s.pin} onClick={() => choose(s)} className="w-full text-left p-2 rounded hover:bg-gray-100">{s.name} • {s.pin}</button>
          ))}
        </div>
        <div className="mt-4">
          <div className="text-sm text-gray-600">Or enter PIN / place</div>
          <input value={pin} onChange={e=>setPin(e.target.value)} placeholder="PIN code" className="w-full border p-2 rounded mt-2" />
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Place name (optional)" className="w-full border p-2 rounded mt-2" />
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            <button onClick={save} className="px-3 py-1 btn-primary rounded">Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
