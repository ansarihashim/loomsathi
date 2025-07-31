'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import ApiLoader from '@/components/ui/ApiLoader'

interface ApiLoaderContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  isTransitioning: boolean
  setIsTransitioning: (transitioning: boolean) => void
  currentRoute: string
  previousRoute: string
  startPageTransition: () => void
  endPageTransition: () => void
  loadingMessage: string
  setLoadingMessage: (message: string) => void
  startLoading: (message?: string) => void
  stopLoading: () => void
}

const ApiLoaderContext = createContext<ApiLoaderContextType | undefined>(undefined)

export const useApiLoaderContext = () => {
  const context = useContext(ApiLoaderContext)
  if (context === undefined) {
    throw new Error('useApiLoaderContext must be used within an ApiLoaderProvider')
  }
  return context
}

interface ApiLoaderProviderProps {
  children: ReactNode
  defaultPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
  defaultSize?: 'sm' | 'md' | 'lg'
}

export const ApiLoaderProvider = ({ 
  children, 
  defaultPosition = 'top-right',
  defaultSize = 'md'
}: ApiLoaderProviderProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentRoute, setCurrentRoute] = useState('')
  const [previousRoute, setPreviousRoute] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Loading data...')
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [shouldShowLoader, setShouldShowLoader] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setPreviousRoute(currentRoute)
    setCurrentRoute(pathname)
    
    // Skip the first load to prevent showing loader on initial page load
    if (isInitialLoad) {
      setIsInitialLoad(false)
      return
    }
    
    // Only start transition when route changes (not on initial load)
    if (currentRoute && currentRoute !== pathname && currentRoute !== '') {
      setIsTransitioning(true)
      setIsLoading(true)
      
      // End transition after a short delay
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setIsLoading(false)
      }, 300)
      
      return () => clearTimeout(timer)
    }
  }, [pathname, currentRoute, isInitialLoad])

  const startPageTransition = () => {
    setIsTransitioning(true)
    setIsLoading(true)
  }

  const endPageTransition = () => {
    setIsTransitioning(false)
    setIsLoading(false)
  }

  const startLoading = (message?: string) => {
    if (message) {
      setLoadingMessage(message)
    }
    setIsLoading(true)
    setShouldShowLoader(true)
  }

  const stopLoading = () => {
    setIsLoading(false)
    setShouldShowLoader(false)
  }

  const value: ApiLoaderContextType = {
    isLoading,
    setIsLoading,
    isTransitioning,
    setIsTransitioning,
    currentRoute,
    previousRoute,
    startPageTransition,
    endPageTransition,
    loadingMessage,
    setLoadingMessage,
    startLoading,
    stopLoading
  }

  return (
    <ApiLoaderContext.Provider value={value}>
      {children}
      {/* Only show loader when explicitly loading, not on initial page loads */}
      {shouldShowLoader && isLoading && (
        <ApiLoader 
          isLoading={isLoading}
          message={loadingMessage}
          position={defaultPosition}
          size={defaultSize}
        />
      )}
    </ApiLoaderContext.Provider>
  )
} 