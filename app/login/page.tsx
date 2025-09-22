'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/api'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const LoginPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required fields validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@gmail\.com$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid @gmail.com address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!/^(?=.*[a-z])(?=.*[^A-Za-z0-9]).{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters, contain a lowercase letter, and a symbol'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    // Add mobile-specific debugging
    console.log('Device info:', {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    })

    try {
      console.log('Attempting login with:', { email: formData.email })
      
      // Add timeout for mobile devices
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Remove credentials: 'include' for mobile compatibility
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok) {
        // Store JWT token and user data
        if (data.token) {
          localStorage.setItem('loomsathi_token', data.token)
          localStorage.setItem('loomsathi_user', JSON.stringify(data.user))
          console.log('Token stored successfully')
        }
        
        setShowSuccess(true)
        setTimeout(() => {
          router.push('/dashboard') // Redirect to dashboard
        }, 2000)
      } else {
        const errorMessage = data.error || data.message || 'Login failed. Please try again.'
        console.error('Login failed:', errorMessage)
        setApiError(errorMessage)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.name === 'AbortError') {
        setApiError('Request timed out. Please check your connection and try again.')
      } else {
        setApiError('Network error. Please check your connection and try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-textile-50 via-white to-primary-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-textile-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">L</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-gray-900">LoomSathi</span>
            </Link>
            <Link 
              href="/"
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-textile-600 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8"
        >
          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 sm:space-x-3"
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="text-green-800 font-semibold text-sm sm:text-base">Login Successful!</h3>
                <p className="text-green-700 text-xs sm:text-sm">Redirecting to dashboard...</p>
              </div>
            </motion.div>
          )}

          {/* API Error Message */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 sm:space-x-3"
            >
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-semibold text-sm sm:text-base">Login Failed</h3>
                <p className="text-red-700 text-xs sm:text-sm">{apiError}</p>
              </div>
            </motion.div>
          )}

          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600 text-sm sm:text-base">Sign in to your LoomSathi account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" autoComplete="off">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-textile-500 focus:border-transparent transition-colors text-sm sm:text-base ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your @gmail.com address"
                autoComplete="email"
                inputMode="email"
              />
              {errors.email && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-textile-500 focus:border-transparent transition-colors text-sm sm:text-base ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  inputMode="text"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-textile-500 hover:bg-textile-600 disabled:bg-textile-300 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              Don't have an account?{' '}
              <Link href="/signup" className="text-textile-600 hover:text-textile-700 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage 