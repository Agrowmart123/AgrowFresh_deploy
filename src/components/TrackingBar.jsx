import React from "react";
import { TRACKING_STEPS } from '../data/notifications'

export default function TrackingBar({ activeStep = 3 }) {
  return (
    <div className="flex items-start gap-0 mt-4">
      {TRACKING_STEPS.map((step, i) => {
        const isDone = i < activeStep
        const isActive = i === activeStep
        const isPending = i > activeStep

        return (
          <div key={step.label} className="flex-1 flex flex-col items-center relative">
            {/* Connector line */}
            {i < TRACKING_STEPS.length - 1 && (
              <div
                className={`absolute top-3.5 left-1/2 right-[-50%] h-0.5 z-0 transition-all duration-500 ${
                  isDone ? 'bg-accent-orange' : 'bg-border'
                }`}
              />
            )}

            {/* Dot */}
            <div
              className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isDone
                  ? 'bg-accent-orange text-black'
                  : isActive
                  ? 'bg-[rgba(255,121,64,0.15)] border-2 border-accent-orange text-accent-orange animate-pulse-glow'
                  : 'bg-surface border-2 border-border text-text-muted'
              }`}
            >
              {isDone ? '✓' : step.icon}
            </div>

            {/* Label */}
            <span
              className={`text-[9px] mt-1.5 text-center font-semibold tracking-wide transition-all ${
                isDone
                  ? 'text-accent-orange'
                  : isActive
                  ? 'text-accent-orange'
                  : 'text-text-muted'
              }`}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}