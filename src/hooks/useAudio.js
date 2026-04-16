import { useRef, useCallback } from 'react'

export function useAudio() {
  const ctxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return ctxRef.current
  }, [])

  const playTone = useCallback((freq, type, duration, vol = 0.3, delay = 0) => {
    try {
      const ac = getCtx()
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.type = type
      osc.frequency.setValueAtTime(freq, ac.currentTime + delay)
      gain.gain.setValueAtTime(0, ac.currentTime + delay)
      gain.gain.linearRampToValueAtTime(vol, ac.currentTime + delay + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration)
      osc.start(ac.currentTime + delay)
      osc.stop(ac.currentTime + delay + duration + 0.05)
    } catch (e) {
      // Silently fail if audio context is unavailable
    }
  }, [getCtx])

  const sounds = {
    success: (enabled) => {
      if (!enabled) return
      playTone(523.25, 'sine', 0.15, 0.22, 0)
      playTone(659.25, 'sine', 0.15, 0.22, 0.12)
      playTone(783.99, 'sine', 0.2, 0.28, 0.24)
      playTone(1046.5, 'sine', 0.35, 0.18, 0.4)
    },
    accept: (enabled) => {
      if (!enabled) return
      playTone(440, 'sine', 0.1, 0.2, 0)
      playTone(554.37, 'sine', 0.1, 0.2, 0.1)
      playTone(659.25, 'sine', 0.2, 0.28, 0.2)
    },
    reject: (enabled) => {
      if (!enabled) return
      playTone(300, 'sawtooth', 0.15, 0.14, 0)
      playTone(220, 'sawtooth', 0.2, 0.14, 0.18)
    },
    track: (enabled) => {
      if (!enabled) return
      playTone(880, 'sine', 0.08, 0.18, 0)
      playTone(880, 'sine', 0.08, 0.18, 0.15)
      playTone(1100, 'sine', 0.15, 0.22, 0.3)
    },
    delivery: (enabled) => {
      if (!enabled) return
      ;[0, 0.1, 0.2, 0.3, 0.4].forEach((d, i) => {
        playTone(523 + i * 80, 'sine', 0.12, 0.18, d)
      })
    },
    code: (enabled) => {
      if (!enabled) return
      for (let i = 0; i < 6; i++) {
        playTone(800 + i * 55, 'square', 0.06, 0.09, i * 0.07)
      }
    },
    chime: (enabled) => {
      if (!enabled) return
      playTone(1046.5, 'sine', 0.1, 0.18, 0)
      playTone(1318.5, 'sine', 0.12, 0.18, 0.1)
      playTone(1046.5, 'sine', 0.2, 0.16, 0.22)
    },
    close: (enabled) => {
      if (!enabled) return
      playTone(660, 'sine', 0.1, 0.14, 0)
      playTone(440, 'sine', 0.15, 0.14, 0.12)
    },
  }

  return sounds
}