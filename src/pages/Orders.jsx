import React, { useEffect, useState } from "react";
import OrderCard from "../pages/OrderCard";
import { getAllOrders } from "../services/ordersApi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setOrders(getAllOrders);
      setLoading(false);
    }, 700);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-9 h-9 rounded-full border-4 border-green-100 border-t-[#68911a] animate-spin" />
        <p className="text-sm text-gray-400">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#68911a" }}>
          My Orders
        </h1>
        {orders.length > 0 && (
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "#f0f7e6", color: "#68911a" }}
          >
            {orders.length} orders
          </span>
        )}
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center px-4">
           <div style={{ width: 200 }}>
             <Lottie animationData={empty} loop={true} />
           </div>
           <p className="text-lg font-semibold text-gray-500">
             Your orders will appear here once you shop
           </p>
           <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-full bg-[#68911a] text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}