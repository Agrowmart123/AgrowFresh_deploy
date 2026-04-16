import React from "react";

export default function DeliveryCode({ code, used = false }) {
  return (
    <div
      className={`mt-3 p-3.5 rounded-xl border text-center ${
        used
          ? 'bg-[rgba(255,179,64,0.04)] border-[rgba(255,179,64,0.15)]'
          : 'bg-gradient-to-br from-[rgba(61,158,255,0.07)] to-[rgba(0,229,160,0.05)] border-[rgba(61,158,255,0.18)]'
      }`}
    >
      <p className="text-[9px] font-bold tracking-[1.8px] uppercase text-text-muted mb-2.5">
        {used ? '✅ Delivery Code Used' : '🔐 Your Delivery Code'}
      </p>
      <div className="flex gap-1.5 justify-center mb-2">
        {code.split('').map((digit, i) => (
          <div
            key={i}
            className={`w-8 h-9 rounded-lg flex items-center justify-center font-syne font-extrabold text-lg transition-all ${
              used
                ? 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,179,64,0.15)] text-text-muted opacity-50'
                : 'bg-[rgba(61,158,255,0.08)] border border-[rgba(61,158,255,0.25)] text-accent-blue'
            }`}
            style={
              !used
                ? {
                    textShadow: '0 0 16px rgba(61,158,255,0.5)',
                    animation: `shimmer 2.5s ease ${i * 0.12}s infinite`,
                  }
                : {}
            }
          >
            {digit}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-text-muted italic">
        {used
          ? 'Code verified & order completed ✓'
          : 'Share with delivery partner to confirm receipt'}
      </p>
    </div>
  )
}