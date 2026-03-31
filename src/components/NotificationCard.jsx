import React, { useState } from 'react'
import { TYPE_STYLES } from '../data/notifications'
import TrackingBar from './TrackingBar'
import DeliveryCode from './DeliveryCode'

export default function NotificationCard({
  notif,
  index,
  onAccept,
  onAction,
  soundEnabled,
  sounds,
}) {
  const [dismissed, setDismissed] = useState(false)
  const styles = TYPE_STYLES[notif.type]

  if (dismissed) return null

  const handleAccept = () => {
    sounds.accept(soundEnabled)
    onAccept(notif.orderId, notif.code)
  }

  const handleAction = (action) => {
    switch (action) {
      case 'track':
      case 'livetrack':
        sounds.track(soundEnabled)
        onAction('Tracking your order in real-time!', '📍')
        break
      case 'view':
        sounds.chime(soundEnabled)
        onAction(`Opening order #${notif.orderId}`, '📦')
        break
      case 'reorder':
        sounds.success(soundEnabled)
        onAction('Placing new order...', '🔄')
        break
      case 'refund':
        sounds.chime(soundEnabled)
        onAction('Refund initiated! 2–3 business days.', '💰')
        break
      case 'rate':
        sounds.delivery(soundEnabled)
        onAction('Thanks for the feedback! ⭐⭐⭐⭐⭐', '⭐')
        break
      case 'invoice':
        sounds.chime(soundEnabled)
        onAction('Invoice sent to your email!', '📄')
        break
      default:
        break
    }
  }

  const actionButtons = {
    accept: (
      <button
        key="accept"
        onClick={handleAccept}
        className="flex-1 py-2.5 px-4 rounded-xl bg-accent-green text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#00ffb3] hover:shadow-[0_4px_20px_rgba(0,229,160,0.4)] active:scale-95 transition-all"
      >
        ✓ Accept Order
      </button>
    ),
    view: (
      <button
        key="view"
        onClick={() => handleAction('view')}
        className="flex-1 py-2.5 px-4 rounded-xl bg-[rgba(61,158,255,0.1)] border border-[rgba(61,158,255,0.2)] text-accent-blue font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-accent-blue hover:text-black active:scale-95 transition-all"
      >
        📦 View Details
      </button>
    ),
    track: (
      <button
        key="track"
        onClick={() => handleAction('track')}
        className="flex-1 py-2.5 px-4 rounded-xl bg-[rgba(255,121,64,0.1)] border border-[rgba(255,121,64,0.2)] text-accent-orange font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-accent-orange hover:text-black active:scale-95 transition-all"
      >
        📍 Track Now
      </button>
    ),
    livetrack: (
      <button
        key="livetrack"
        onClick={() => handleAction('livetrack')}
        className="flex-1 py-2.5 px-4 rounded-xl bg-[rgba(255,121,64,0.1)] border border-[rgba(255,121,64,0.2)] text-accent-orange font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-accent-orange hover:text-black active:scale-95 transition-all"
      >
        📡 Live Track
      </button>
    ),
    reorder: (
      <button
        key="reorder"
        onClick={() => handleAction('reorder')}
        className="flex-1 py-2.5 px-4 rounded-xl bg-accent-orange text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-110 hover:shadow-[0_4px_20px_rgba(255,121,64,0.4)] active:scale-95 transition-all"
      >
        🔄 Reorder
      </button>
    ),
    refund: (
      <button
        key="refund"
        onClick={() => handleAction('refund')}
        className="flex-1 py-2.5 px-4 rounded-xl bg-[rgba(61,158,255,0.1)] border border-[rgba(61,158,255,0.2)] text-accent-blue font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-accent-blue hover:text-black active:scale-95 transition-all"
      >
        💰 Refund Status
      </button>
    ),
    rate: (
      <button
        key="rate"
        onClick={() => handleAction('rate')}
        className="flex-1 py-2.5 px-4 rounded-xl bg-accent-amber text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-110 hover:shadow-[0_4px_20px_rgba(255,179,64,0.4)] active:scale-95 transition-all"
      >
        ⭐ Rate Order
      </button>
    ),
    invoice: (
      <button
        key="invoice"
        onClick={() => handleAction('invoice')}
        className="flex-1 py-2.5 px-4 rounded-xl bg-[rgba(255,255,255,0.05)] border border-border text-text-secondary font-bold text-xs flex items-center justify-center gap-1.5 hover:border-text-muted hover:text-text-primary active:scale-95 transition-all"
      >
        🧾 Get Invoice
      </button>
    ),
  }

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border border-border bg-card
        ${styles.bar} ${styles.glow} ${styles.borderHover}
        hover:bg-card-hover hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)]
        cursor-pointer transition-all duration-300
        animate-slide-up
      `}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Unread dot */}
      {notif.unread && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent-green shadow-[0_0_8px_rgba(0,229,160,0.8)]" />
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3.5">
          {/* Icon */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${styles.iconBg}`}
          >
            {notif.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <span
              className={`inline-flex items-center text-[10px] font-bold tracking-[1px] uppercase px-2.5 py-1 rounded-md mb-1.5 ${styles.tagBg} ${styles.tagText}`}
            >
              {notif.tag}
            </span>
            <h3 className="font-syne font-bold text-[15px] leading-snug text-text-primary mb-1">
              {notif.title}
            </h3>
            <p className="text-[13px] text-text-secondary leading-relaxed">{notif.body}</p>
            <p className="text-[11px] text-text-muted mt-1.5 font-medium">⏱ {notif.time}</p>
          </div>
        </div>

        {/* Order info row */}
        <div className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-xl bg-[rgba(255,255,255,0.03)] border border-border">
          <span className="text-sm">🧾</span>
          <span className="text-xs text-text-secondary font-syne font-semibold">
            Order{' '}
            <span className="text-text-primary">#{notif.orderId}</span>
          </span>
          <span
            className={`ml-auto font-syne font-extrabold text-sm ${
              notif.type === 'rejected' ? 'text-accent-red' : 'text-accent-green'
            }`}
          >
            {notif.amount}
          </span>
        </div>

        {/* Tracking bar */}
        {notif.type === 'tracking' && <TrackingBar activeStep={notif.trackingStep ?? 3} />}

        {/* Delivery code */}
        {notif.hasCode && notif.code && (
          <DeliveryCode code={notif.code} used={notif.codeUsed ?? false} />
        )}

        {/* Action buttons */}
        {notif.actions?.length > 0 && (
          <div className="flex gap-2 mt-3.5">
            {notif.actions.map((action) => actionButtons[action])}
          </div>
        )}
      </div>
    </div>
  )
}