'use client'

import { useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useApiLoaderContext } from '@/contexts/ApiLoaderContext'

interface UseNavigationLoaderOptions {
  showOnNavigation?: boolean
  showOnDataFetch?: boolean
  defaultMessage?: string
}

export const useNavigationLoader = (options: UseNavigationLoaderOptions = {}) => {
  const {
    showOnNavigation = true,
    showOnDataFetch = true,
    defaultMessage = 'Loading...'
  } = options

  const router = useRouter()
  const pathname = usePathname()
  const { startLoading, stopLoading } = useApiLoaderContext()

  // Show loader when navigating to new routes
  const navigateWithLoader = useCallback((href: string, message?: string) => {
    if (showOnNavigation) {
      startLoading(message || defaultMessage)
    }
    router.push(href)
  }, [router, startLoading, showOnNavigation, defaultMessage])

  // Show loader during data fetching
  const fetchWithLoader = useCallback(async <T>(
    fetchOperation: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    if (showOnDataFetch) {
      startLoading(message || defaultMessage)
    }

    try {
      const result = await fetchOperation()
      return result
    } finally {
      if (showOnDataFetch) {
        stopLoading()
      }
    }
  }, [startLoading, stopLoading, showOnDataFetch, defaultMessage])

  // Auto-stop loader when route changes
  useEffect(() => {
    stopLoading()
  }, [pathname, stopLoading])

  return {
    navigateWithLoader,
    fetchWithLoader,
    startLoading,
    stopLoading
  }
} 