'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface UsePageTransitionReturn {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  isTransitioning: boolean
  startTransition: () => void
  endTransition: () => void
}

export const usePageTransition = (): UsePageTransitionReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Reset transition state when pathname changes
  useEffect(() => {
    setIsTransitioning(false)
    setIsLoading(false)
  }, [pathname])

  const startTransition = () => {
    setIsTransitioning(true)
    setIsLoading(true)
  }

  const endTransition = () => {
    setIsTransitioning(false)
    setIsLoading(false)
  }

  return {
    isLoading,
    setIsLoading,
    isTransitioning,
    startTransition,
    endTransition
  }
} 