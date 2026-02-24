import React from 'react'

export default function Skeleton({ className = 'h-4 w-full', rounded = true }) {
  return (
    <div className={`animate-pulse bg-gray-200 ${rounded ? 'rounded' : ''} ${className}`}></div>
  )
}
