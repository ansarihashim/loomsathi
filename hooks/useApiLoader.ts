'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface UseApiLoaderReturn {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  startLoading: (message?: string) => void
  stopLoading: () => void
  loadingMessage: string
  setLoadingMessage: (message: string) => void
}

export const useApiLoader = (): UseApiLoaderReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Loading data...')
  const pathname = usePathname()

  // Reset loading state when route changes
  useEffect(() => {
    setIsLoading(false)
    setLoadingMessage('Loading data...')
  }, [pathname])

  const startLoading = useCallback((message?: string) => {
    if (message) {
      setLoadingMessage(message)
    }
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  return {
    isLoading,
    setIsLoading,
    startLoading,
    stopLoading,
    loadingMessage,
    setLoadingMessage
  }
} 