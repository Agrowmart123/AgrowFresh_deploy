import React from 'react'
import { useToast } from '../context/ToastContext'

export default function Toast() {
  const { toasts } = useToast()
  if (!toasts || toasts.length === 0) return null
  return (
    <div className="fixed right-4 top-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`px-4 py-2 rounded shadow text-white ${t.type === 'error' ? 'bg-red-600' : t.type === 'success' ? 'bg-green-600' : 'bg-gray-800'}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
