import {
  ArrowLeft, Wallet, ArrowUpRight, ArrowDownLeft,
  Plus, CreditCard, TrendingUp, TrendingDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const mockTransactions = [
  { id: "1", type: "credit", amount: 50.0,  description: "Added to wallet",   date: new Date(2026, 2, 4) },
  { id: "2", type: "debit",  amount: 12.5,  description: "Order #ORD-A1B2C",  date: new Date(2026, 2, 3) },
  { id: "3", type: "credit", amount: 5.0,   description: "Cashback reward",   date: new Date(2026, 2, 2) },
  { id: "4", type: "debit",  amount: 28.75, description: "Order #ORD-X9Y8Z",  date: new Date(2026, 2, 1) },
  { id: "5", type: "credit", amount: 100.0, description: "Added to wallet",   date: new Date(2026, 1, 28) },
];

export default function Wallet_Page() {
  const navigate = useNavigate();
  const [balance] = useState(113.75);
  const [transactions] = useState(mockTransactions);

  const totalIn  = transactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === "debit" ).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-black tracking-tight">My Wallet</h1>
            <p className="text-xs text-gray-400">Manage your balance & transactions</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-4 pb-20">

        {/* ── Balance Card ── */}
        <div
          className="rounded-2xl p-5 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #68911a 0%, #4f6e13 100%)" }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -right-2 w-40 h-40 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                Available Balance
              </span>
            </div>

            <p className="text-4xl font-bold tracking-tight mb-1">
              ₹{balance.toFixed(2)}
            </p>
            <p className="text-xs text-white/60 mb-6">AgrowFresh Wallet</p>

            {/* Stats row */}
            <div className="flex gap-3 mb-5">
              <div className="flex-1 bg-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <TrendingDown className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-white/60">Total In</p>
                  <p className="text-sm font-bold text-white">₹{totalIn.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex-1 bg-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-white/60">Total Out</p>
                  <p className="text-sm font-bold text-white">₹{totalOut.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl bg-white font-bold text-sm flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                style={{ color: "#68911a" }}
              >
                <Plus className="w-4 h-4" /> Add Money
              </button>
              <button
                onClick={() => navigate("/bank")}
                className="flex-1 py-2.5 rounded-xl border border-white/30 text-white font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors"
              >
                <CreditCard className="w-4 h-4" /> Bank
              </button>
            </div>
          </div>
        </div>

        {/* ── Quick Add Chips ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Add</p>
          <div className="flex gap-2">
            {[50, 100, 200, 500].map((amt) => (
              <button
                key={amt}
                className="flex-1 py-2 rounded-xl text-sm font-bold border-2 border-gray-100 text-gray-600 hover:border-[#68911a] hover:text-[#68911a] hover:bg-[#f0f7e6] transition-all"
              >
                +₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* ── Transactions ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4" style={{ color: "#68911a" }} />
              <span className="text-xs font-bold text-black uppercase tracking-wider">
                Recent Transactions
              </span>
            </div>
            <span className="text-[11px] font-semibold text-gray-400">
              {transactions.length} total
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <span className="text-4xl">💸</span>
              <p className="font-bold text-black text-sm">No transactions yet</p>
              <p className="text-xs text-gray-400">Add money to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3.5">
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === "credit" ? "bg-[#f0f7e6]" : "bg-red-50"
                    }`}
                  >
                    {tx.type === "credit"
                      ? <ArrowDownLeft className="w-4 h-4" style={{ color: "#68911a" }} />
                      : <ArrowUpRight  className="w-4 h-4 text-red-400" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-black line-clamp-1">
                      {tx.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {tx.date.toLocaleDateString("en-IN", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-bold ${
                        tx.type === "credit" ? "" : "text-red-500"
                      }`}
                      style={tx.type === "credit" ? { color: "#68911a" } : {}}
                    >
                      {tx.type === "credit" ? "+" : "−"}₹{tx.amount.toFixed(2)}
                    </span>
                    <p className={`text-[10px] mt-0.5 font-semibold ${
                      tx.type === "credit" ? "text-[#68911a]" : "text-red-400"
                    }`}>
                      {tx.type === "credit" ? "Credited" : "Debited"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Security Note ── */}
        <div className="flex items-center gap-2.5 bg-[#f0f7e6] rounded-xl px-4 py-3">
          <span className="text-base shrink-0">🔒</span>
          <p className="text-xs text-gray-600">
            Wallet transactions are <span className="font-bold text-black">encrypted & protected</span> by 256-bit SSL security.
          </p>
        </div>

      </main>
    </div>
  );
}