import React, { createContext, useContext, useEffect, useState } from 'react'

const LocationContext = createContext()

export function useLocation() {
  return useContext(LocationContext)
}

export function LocationProvider({ children }){
  const [location, setLocation] = useState(() => {
    try{
      return JSON.parse(localStorage.getItem('ag_location')) || { name: 'Select location', pin: '' }
    }catch(e){
      return { name: 'Select location', pin: '' }
    }
  })

  useEffect(() => {
    localStorage.setItem('ag_location', JSON.stringify(location))
  }, [location])

  const value = { location, setLocation }
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}
