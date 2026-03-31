import React, { useState, useEffect, useCallback } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { NOTIFICATIONS, FILTERS } from '../data/notifications'
import { useAudio } from '../hooks/useAudio'
import NotificationCard from '../components/NotificationCard'
import DeliveryCodeModal from '../components/DeliveryCodeModal'
import SoundWave from '../components/SoundWave'
import Toast from '../components/Toast'

export default function Notification() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [activeFilter, setActiveFilter] = useState('all')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [bellRinging, setBellRinging] = useState(false)
  const [modal, setModal] = useState({ open: false, orderId: '', code: '' })
  const [toast, setToast] = useState({ visible: false, message: '', icon: '🔔' })

  const sounds = useAudio()

  const showToast = useCallback((message, icon = '🔔') => {
    setToast({ visible: true, message, icon })
    setBellRinging(true)
    setTimeout(() => setBellRinging(false), 700)
  }, [])

  const hideToast = useCallback(() => {
    setToast((t) => ({ ...t, visible: false }))
  }, [])

  // Initial chime on mount
  useEffect(() => {
    const t = setTimeout(() => {
      sounds.chime(true)
      showToast('5 new order notifications!', '🔔')
    }, 900)
    return () => clearTimeout(t)
  }, [])

  const toggleSound = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    if (next) {
      sounds.chime(true)
      showToast('Sound notifications ON', '🔔')
    } else {
      showToast('Sound notifications OFF', '🔕')
    }
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
    sounds.chime(soundEnabled)
    showToast('All notifications marked as read', '✓')
  }

  const handleAccept = (orderId, code) => {
    setModal({ open: true, orderId, code })
    // Mark that notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.orderId === orderId ? { ...n, unread: false } : n))
    )
  }

  const closeModal = () => {
    sounds.close(soundEnabled)
    setModal({ open: false, orderId: '', code: '' })
    showToast('Code saved. Enjoy your order! 🎉', '✅')
  }

  const handleAction = (message, icon) => {
    showToast(message, icon)
  }

  const filtered =
    activeFilter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === activeFilter)

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleFilter = (id) => {
    setActiveFilter(id)
    sounds.chime(soundEnabled)
  }

  return (
    <div className="min-h-screen bg-bg relative overflow-x-hidden pt-6">
      {/* Ambient background glows */}
      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,229,160,0.04),transparent_70%)] pointer-events-none" />
      <div className="fixed -bottom-40 -right-20 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(61,158,255,0.05),transparent_70%)] pointer-events-none" />

      {/* App container */}
      <div className="max-w-3xl mx-auto pb-16 relative z-10">

        {/* ─── Header ─────────────────────────────────── */}
        <div className="sticky top-0 z-40 bg-[#68911a] backdrop-blur-xl border-b border-border rounded-xl">
          <div className="flex items-center justify-between px-6 py-5">
            {/* Title + badge */}
            <div className="flex items-center gap-3">
              <h1 className="font-syne text-white font-extrabold text-[22px] tracking-tight">
                Notification
              </h1>
              {unreadCount > 0 && (
                <span className="bg-accent-green text-black font-syne font-bold text-[11px] px-2.5 py-0.5 rounded-full tracking-wide">
                  {unreadCount} New
                </span>
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {soundEnabled && <SoundWave />}

              {/* Sound toggle */}
              <button
                onClick={toggleSound}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                  bellRinging ? 'animate-ring' : ''
                } ${
                  soundEnabled
                    ? 'border-accent-green bg-[#68911a] text-accent-green'
                    : 'border-border bg-surface text-text-secondary hover:border-text-muted'
                }`}
                title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
              >
                {soundEnabled ? <Bell size={15} /> : <BellOff size={15} />}
              </button>

              {/* Mark all read */}
              <button
                onClick={markAllRead}
                className="text-xs text-accent-blue font-semibold px-2.5 py-1.5 rounded-lg hover:bg-[rgba(61,158,255,0.1)] transition-all"
              >
                Mark all read
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 px-6 pb-4 overflow-x-auto scrollbar-none">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => handleFilter(f.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs text-white font-semibold border transition-all whitespace-nowrap ${
                  activeFilter === f.id
                    ? 'bg-accent-green border-accent-green text-white font-bold'
                    : 'border-border bg-transparent text-text-secondary hover:border-text-muted hover:text-text-primary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Notifications ───────────────────────────── */}
        <div className="px-4 pt-4 flex flex-col gap-3">

          {/* Today section */}
          {filtered.some((n) => ['n1', 'n2', 'n3', 'n4'].includes(n.id)) && (
            <>
              <p className="text-[11px] font-bold tracking-[1.8px] uppercase text-text-muted px-1 pt-2">
                Today
              </p>
              {filtered
                .filter((n) => ['n1', 'n2', 'n3', 'n4'].includes(n.id))
                .map((notif, i) => (
                  <NotificationCard
                    key={notif.id}
                    notif={notif}
                    index={i}
                    onAccept={handleAccept}
                    onAction={handleAction}
                    soundEnabled={soundEnabled}
                    sounds={sounds}
                  />
                ))}
            </>
          )}

          {/* Yesterday section */}
          {filtered.some((n) => n.id === 'n5') && (
            <>
              <p className="text-[11px] font-bold tracking-[1.8px] uppercase text-text-muted px-1 pt-3">
                Yesterday
              </p>
              {filtered
                .filter((n) => n.id === 'n5')
                .map((notif, i) => (
                  <NotificationCard
                    key={notif.id}
                    notif={notif}
                    index={i}
                    onAccept={handleAccept}
                    onAction={handleAction}
                    soundEnabled={soundEnabled}
                    sounds={sounds}
                  />
                ))}
            </>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
              <span className="text-5xl mb-4 animate-float-up">🔔</span>
              <p className="font-syne font-bold text-text-secondary text-lg">All caught up!</p>
              <p className="text-text-muted text-sm mt-1">No notifications in this category</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Accept / Code Modal ──────────────────────── */}
      <DeliveryCodeModal
        isOpen={modal.open}
        onClose={closeModal}
        orderId={modal.orderId}
        code={modal.code}
        soundEnabled={soundEnabled}
        sounds={sounds}
      />

      {/* ─── Toast ───────────────────────────────────── */}
      <Toast
        message={toast.message}
        icon={toast.icon}
        visible={toast.visible}
        onHide={hideToast}
      />
    </div>
  )
}