import React from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, Clock } from "lucide-react";

const statusConfig = {
  Delivered: {
    bg: "bg-[#f0f7e6]",
    text: "text-[#68911a]",
    dot: "bg-[#68911a]",
    bar: "bg-[#68911a]",
  },
  "Out for Delivery": {
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-400",
    bar: "bg-amber-400",
  },
  Preparing: {
    bg: "bg-blue-50",
    text: "text-blue-500",
    dot: "bg-blue-400",
    bar: "bg-blue-400",
  },
};

export default function OrderCard({ order }) {
  const config = statusConfig[order.status] || statusConfig["Preparing"];

  const date = new Date(order.createdAt);
  const dateStr = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      to={`/order/${order.id}`}
      className="flex bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Left accent bar */}
      <div className={`w-1 shrink-0 ${config.bar}`} />

      <div className="flex-1 px-4 py-3.5">
        {/* Top row */}
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-9 h-9 rounded-xl bg-[#f8faf3] flex items-center justify-center shrink-0">
            <Package size={17} color="#68911a" />
          </div>

          {/* Order info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-black tracking-tight">
              Order #{order.id}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock size={11} className="text-gray-300" />
              <span className="text-[11px] text-gray-400">
                {dateStr} · {timeStr}
              </span>
            </div>
          </div>

          {/* Status pill */}
          <div
            className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${config.bg} ${config.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {order.status}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-50 my-3" />

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">
            {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold" style={{ color: "#68911a" }}>
              ₹{order.totalAmount}
            </span>
            <ChevronRight size={15} className="text-gray-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}