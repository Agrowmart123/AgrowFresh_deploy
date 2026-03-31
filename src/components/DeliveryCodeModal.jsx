import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function DeliveryCodeModal({ isOpen, onClose, orderId, code, soundEnabled, sounds }) {
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => sounds.code(soundEnabled), 400)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-sm bg-card border border-border rounded-3xl p-8 animate-scale-in overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(0,229,160,0.12),transparent_70%)] pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-all"
        >
          <X size={14} />
        </button>

        {/* Icon */}
        <div className="text-center mb-5">
          <span className="text-5xl animate-float-up inline-block">🎉</span>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="font-syne font-extrabold text-xl text-text-primary mb-2">
            Delivery Accepted!
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Show this 6-digit code to the delivery partner to confirm your receipt.
          </p>
          <p className="text-text-muted text-xs mt-1">
            Order <span className="text-text-primary font-semibold">#{orderId}</span>
          </p>
        </div>

        {/* Code display */}
        <div className="bg-gradient-to-br from-[rgba(0,229,160,0.08)] to-[rgba(61,158,255,0.05)] border border-[rgba(0,229,160,0.2)] rounded-2xl p-5 mb-5">
          <p className="text-xs font-bold tracking-[1.8px] uppercase text-text-muted text-center mb-4">
            🔐 Your Delivery Code
          </p>
          <div className="flex gap-2 justify-center">
            {code.split('').map((digit, i) => (
              <div
                key={i}
                className="w-10 h-12 rounded-xl flex items-center justify-center font-syne font-extrabold text-2xl text-accent-green border border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.06)]"
                style={{
                  textShadow: '0 0 20px rgba(0,229,160,0.5)',
                  animation: `digitReveal 0.35s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s both`,
                }}
              >
                {digit}
              </div>
            ))}
          </div>
          <p className="text-xs text-text-muted text-center mt-3 italic">
            This code expires once used. Keep it safe!
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl font-syne font-bold text-sm bg-accent-green text-black hover:bg-[#00ffb3] transition-all hover:shadow-[0_4px_24px_rgba(0,229,160,0.4)] active:scale-95 tracking-wide"
        >
          Got it! 👍
        </button>
      </div>
    </div>
  )
}