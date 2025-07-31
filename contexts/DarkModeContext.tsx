'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface DarkModeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
  setDarkMode: (enabled: boolean) => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export const useDarkMode = () => {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}

interface DarkModeProviderProps {
  children: React.ReactNode
}

export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Get dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('loomsathi_dark_mode')
    const prefersDarkMode = savedDarkMode !== null ? JSON.parse(savedDarkMode) : false
    
    setIsDarkMode(prefersDarkMode)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return

    // Save to localStorage
    localStorage.setItem('loomsathi_dark_mode', JSON.stringify(isDarkMode))

    // Apply dark mode to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode, isInitialized])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  const setDarkMode = (enabled: boolean) => {
    setIsDarkMode(enabled)
  }

  const value = {
    isDarkMode,
    toggleDarkMode,
    setDarkMode
  }

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  )
} 