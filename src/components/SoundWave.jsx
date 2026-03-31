import React from "react";

export default function SoundWave() {
  const delays = ['0s', '0.15s', '0.3s', '0.45s']
  const heights = ['h-1.5', 'h-3', 'h-2', 'h-3.5']

  return (
    <div className="flex items-center gap-0.5 h-5">
      {delays.map((delay, i) => (
        <div
          key={i}
          className={`w-0.5 ${heights[i]} rounded-full bg-accent-green`}
          style={{ animation: `wave 1.1s ease ${delay} infinite` }}
        />
      ))}
    </div>
  )
}