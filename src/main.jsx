import React from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './routes/Routes'
import './index.css'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { LocationProvider } from './context/LocationContext'
import Toast from './components/Toast'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <LocationProvider>
            <AppRoutes />
            <Toast />
          </LocationProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
)
