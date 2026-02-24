import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import Layout from '../components/Layout'

const Home = lazy(() => import('../pages/Home'))
const Category = lazy(() => import('../pages/Category'))
const Shop = lazy(() => import('../pages/Shop'))
const Shops = lazy(() => import('../pages/Shops'))
const Product = lazy(() => import('../pages/Product'))
const CartPage = lazy(() => import('../pages/Cart'))
const Checkout = lazy(() => import('../pages/Checkout'))
const Orders = lazy(() => import('../pages/Orders'))
const Login = lazy(() => import('../pages/Login'))
const Signup = lazy(() => import('../pages/Signup'))
const NotFound = lazy(() => import('../pages/NotFound'))
const Account = lazy(() => import('../pages/Account'))
const About = lazy(() => import('../pages/About'))
const Contact = lazy(() => import('../pages/Contact'))

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/category/:categoryName" element={<Layout><Category /></Layout>} />
          <Route path="/product/:productId" element={<Layout><Product /></Layout>} />
          <Route path="/shop/:shopId" element={<Layout><Shop /></Layout>} />
          <Route path="/shops" element={<Layout><Shops /></Layout>} />
          <Route path="/cart" element={<Layout><CartPage /></Layout>} />
          <Route path="/checkout" element={<Layout><ProtectedRoute><Checkout /></ProtectedRoute></Layout>} />
          <Route path="/orders" element={<Layout><ProtectedRoute><Orders /></ProtectedRoute></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/signup" element={<Layout><Signup /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/account" element={<Layout><React.Suspense fallback={<div className="p-8">Loading...</div>}><Account /></React.Suspense></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
