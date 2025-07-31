'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Settings,
  X,
  ArrowLeft,
  Shield,
  Camera,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthGuard from '@/components/auth/AuthGuard'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import SmoothNavigation from '@/components/ui/SmoothNavigation'
import { useApiLoaderContext } from '@/contexts/ApiLoaderContext'
import { useNavigationLoader } from '@/hooks/useNavigationLoader'
import PersonalInformation from '@/components/settings/PersonalInformation'
import SecuritySettings from '@/components/settings/SecuritySettings'
import AppearanceSettings from '@/components/settings/AppearanceSettings'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
}

const SettingsPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const [activeTab, setActiveTab] = useState('profile')
  const { startLoading, stopLoading } = useApiLoaderContext()
  const { navigateWithLoader } = useNavigationLoader({
    showOnNavigation: true,
    defaultMessage: 'Loading page...'
  })

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser)
  }



  useEffect(() => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('loomsathi_token')
      if (!token) {
        router.push('/login')
        return
      }

      // Get user data from localStorage
      const userData = localStorage.getItem('loomsathi_user')
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } catch (parseError) {
          console.error('Error parsing user data:', parseError)
          // Set fallback user data
          setUser({
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
            phone: '+91 9876543210',
            role: 'user'
          })
        }
      } else {
        // Set fallback user data if none exists
        setUser({
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          phone: '+91 9876543210',
          role: 'user'
        })
      }
    } catch (error) {
      console.error('Error initializing settings page:', error)
      // Set fallback user data on error
      setUser({
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '+91 9876543210',
        role: 'user'
      })
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Close sidebar when clicking on navigation items
  const handleNavigationClick = () => {
    setIsSidebarOpen(false)
  }

  // Handle overlay click to close sidebar


  // Toggle sidebar function


  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <LoadingSpinner message="Loading settings..." size="lg" />
        </div>
      </AuthGuard>
    )
  }

  // Fallback error state
  if (!user) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Unable to Load Settings</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              There was an error loading your settings. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-textile-600 text-white rounded-lg hover:bg-textile-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ErrorBoundary>
                  <SettingsContent
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleUserUpdate={handleUserUpdate}
          handleNavigationClick={handleNavigationClick}
        />
        </ErrorBoundary>
      </div>
    </AuthGuard>
  )
}

// Error Boundary Component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Something Went Wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            There was an error loading the settings page.
          </p>
          <button
            onClick={() => setHasError(false)}
            className="px-4 py-2 bg-textile-600 text-white rounded-lg hover:bg-textile-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div onError={() => setHasError(true)}>
      {children}
    </div>
  )
}

// Settings Content Component
interface SettingsContentProps {
  user: User
  activeTab: string
  setActiveTab: (tab: string) => void
  handleUserUpdate: (user: User) => void
  handleNavigationClick: () => void
}

const SettingsContent = ({
  user,
  activeTab,
  setActiveTab,
  handleUserUpdate,
  handleNavigationClick,
}: SettingsContentProps) => {
  return (
    <>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4 lg:px-6">
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/dashboard"
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-textile-500 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Account & Profile Settings</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-4 lg:p-6">
          {/* Demo Mode Notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">Demo Mode</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Some features are in demo mode. Your changes will be saved locally but may not persist on the server.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Settings Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col sm:flex-row" aria-label="Tabs">
                {[
                  { id: 'profile', label: 'Personal Information', icon: User },
                  { id: 'security', label: 'Security', icon: Shield },
                  { id: 'appearance', label: 'Appearance', icon: Moon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-6 border-b-2 sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 font-medium text-sm transition-colors w-full sm:w-auto ${
                      activeTab === tab.id
                        ? 'border-textile-500 text-textile-600 bg-textile-50 dark:bg-textile-900/20'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4 lg:p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <PersonalInformation user={user} onUserUpdate={handleUserUpdate} />
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <SecuritySettings user={user} />
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div
                    key="appearance"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <AppearanceSettings user={user} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>


    </>
  )
}

export default SettingsPage 