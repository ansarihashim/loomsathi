'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface AnimationContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  isTransitioning: boolean
  setIsTransitioning: (transitioning: boolean) => void
  currentRoute: string
  previousRoute: string
  startPageTransition: () => void
  endPageTransition: () => void
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export const useAnimation = () => {
  const context = useContext(AnimationContext)
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider')
  }
  return context
}

interface AnimationProviderProps {
  children: ReactNode
}

export const AnimationProvider = ({ children }: AnimationProviderProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentRoute, setCurrentRoute] = useState('')
  const [previousRoute, setPreviousRoute] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    setPreviousRoute(currentRoute)
    setCurrentRoute(pathname)
    
    // Start transition when route changes
    if (currentRoute && currentRoute !== pathname) {
      setIsTransitioning(true)
      setIsLoading(true)
      
      // End transition after a short delay
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setIsLoading(false)
      }, 300)
      
      return () => clearTimeout(timer)
    }
  }, [pathname, currentRoute])

  const startPageTransition = () => {
    setIsTransitioning(true)
    setIsLoading(true)
  }

  const endPageTransition = () => {
    setIsTransitioning(false)
    setIsLoading(false)
  }

  const value: AnimationContextType = {
    isLoading,
    setIsLoading,
    isTransitioning,
    setIsTransitioning,
    currentRoute,
    previousRoute,
    startPageTransition,
    endPageTransition
  }

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  )
} 