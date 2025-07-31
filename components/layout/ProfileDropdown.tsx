'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LogOut, 
  User, 
  Settings,
  ChevronDown,
  Mail,
  Shield
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
}

interface ProfileDropdownProps {
  user: User | null
}

const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('loomsathi_token')
    localStorage.removeItem('loomsathi_user')
    router.push('/login')
  }

  const getRoleDisplay = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'Administrator'
      case 'manager': return 'Manager'
      case 'supervisor': return 'Supervisor'
      default: return role
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-textile-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-xs sm:text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div className="hidden sm:block text-sm">
          <span className="text-gray-600">Welcome, </span>
          <span className="font-semibold text-gray-900">{user?.name || 'User'}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            {/* User Info Section */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-textile-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.name || 'User'}</h3>
                  <p className="text-sm text-gray-500">{getRoleDisplay(user?.role || 'User')}</p>
                </div>
              </div>
              
              {user?.email && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  setIsOpen(false)
                  router.push('/dashboard/settings')
                }}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileDropdown 