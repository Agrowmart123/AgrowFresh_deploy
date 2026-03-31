import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import ScrollToTop from "../components/ScrollToTop";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Forgot_Password = lazy(() => import("../pages/ForgotPassword"));
const Cart = lazy(() => import("../pages/Cart"));
const Profile = lazy(() => import("../pages/Profile"));
const Orders = lazy(() => import("../pages/Orders"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const Address = lazy(() => import("../pages/Address"));
const Wallet = lazy(() => import("../pages/Wallet"));
const Sell = lazy(() => import("../pages/Sell"));
const Product = lazy(() => import("../pages/Product"));
const Category = lazy(() => import("../pages/Category"));
const Shops = lazy(() => import("../pages/Shops"));
const Shop = lazy(() => import("../pages/Shop"));
const Checkout = lazy(() => import("../pages/Checkout"));
const PaymentGateway = lazy(() => import("../pages/PaymentGateway"));
const OrderStatus = lazy(() => import("../pages/OrderStatus"));
const FAQ = lazy(() => import("../pages/FAQ"));
const ContactSupport = lazy(() => import("../pages/ContactSupport"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const Terms = lazy(() => import("../pages/Terms"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Contact = lazy(() => import("../pages/Contact"));
const FreshProducts = lazy(() => import("../pages/FreshProducts"));
const Farmers = lazy(() => import("../pages/Farmers"));
const FarmerDetail = lazy(() => import("../pages/FarmerDetail"));
const Notification = lazy(() => import("../pages/Notification"));
const OrderDetails = lazy(() => import("../pages/OrderDetails"));
const BankDetails = lazy(() => import("../pages/BankDetails"));
const RefundPage = lazy(() => import("../pages/RefundPage"));
const About = lazy(() => import("../pages/About"));
const JoinOurTeam = lazy(() => import("../pages/JoinOurTeam"));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
            Loading...
          </div>
        }
      >
        {" "}
        <Routes>
          {/* PUBLIC ROUTES */}

          <Route path="/" element={<Home />} />

          <Route path="/fresh_products" element={<FreshProducts />} />

          <Route path="/category/:name" element={<Category />} />

          <Route path="/product/:id" element={<Product />} />

          <Route path="/shops" element={<Shops />} />

          <Route path="/shop/:id" element={<Shop />} />

          <Route path="/farmers" element={<Farmers />} />
          <Route path="/farmers/:id" element={<FarmerDetail />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/sell" element={<Sell />} />

          <Route path="/faq" element={<FAQ />} />

          <Route path="/support" element={<ContactSupport />} />

          <Route path="/privacy" element={<PrivacyPolicy />} />

          <Route path="/terms" element={<Terms />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/forgot-password" element={<Forgot_Password />} />


          <Route path="/careers" element={<JoinOurTeam />} />

          <Route
            path="/bank"
            element={
              <ProtectedRoute>
                <BankDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/refund"
            element={
              <ProtectedRoute>
                <RefundPage />
              </ProtectedRoute>
            }
          />

          {/* GUEST ROUTES */}

          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <GuestRoute>
                <Signup />
              </GuestRoute>
            }
          />

          {/* PROTECTED ROUTES */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-status"
            element={
              <ProtectedRoute>
                <OrderStatus />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
                <Wishlist />
            }
          />

          <Route
            path="/address"
            element={
              <ProtectedRoute>
                <Address />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentGateway />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notification"
            element={
              <ProtectedRoute>
                <Notification />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />

          {/* NOT FOUND */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />
    </BrowserRouter>
  );
}
