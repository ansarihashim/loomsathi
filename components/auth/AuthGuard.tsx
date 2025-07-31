'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('loomsathi_token')
      
      if (!token) {
        router.push('/login')
        return
      }

      try {
        // Verify token with backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          // Token is invalid, clear storage and redirect
          localStorage.removeItem('loomsathi_token')
          localStorage.removeItem('loomsathi_user')
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('loomsathi_token')
        localStorage.removeItem('loomsathi_user')
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-textile-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default AuthGuard 