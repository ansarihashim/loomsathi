'use client'

import { ComponentType, useEffect } from 'react'
import { useApiLoader } from '@/hooks/useApiLoader'
import ApiLoader from './ApiLoader'

interface WithApiLoaderProps {
  loadingMessage?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
  size?: 'sm' | 'md' | 'lg'
}

export function withApiLoader<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithApiLoaderProps = {}
) {
  const { loadingMessage = 'Loading data...', position = 'top-right', size = 'md' } = options

  return function WithApiLoaderComponent(props: P) {
    const { isLoading, loadingMessage: currentMessage } = useApiLoader()

    return (
      <>
        <WrappedComponent {...props} />
        <ApiLoader 
          isLoading={isLoading} 
          message={currentMessage || loadingMessage}
          position={position}
          size={size}
        />
      </>
    )
  }
} 