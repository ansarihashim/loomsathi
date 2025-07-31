'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Save,
  Key,
  Smartphone
} from 'lucide-react'

interface SecuritySettingsProps {
  user: any
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface PasswordErrors {
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
  general?: string
}

const SecuritySettings = ({ user }: SecuritySettingsProps) => {
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({})
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [isPasswordSuccess, setIsPasswordSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [isTwoFactorLoading, setIsTwoFactorLoading] = useState(false)

  const validatePasswordForm = (): boolean => {
    const newErrors: PasswordErrors = {}

    // Current password validation
    if (!passwordForm.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required'
    }

    // New password validation
    if (!passwordForm.newPassword.trim()) {
      newErrors.newPassword = 'New password is required'
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])/.test(passwordForm.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one lowercase letter'
    } else if (!/(?=.*[^A-Za-z0-9])/.test(passwordForm.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one symbol'
    }

    // Confirm password validation
    if (!passwordForm.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setPasswordErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePasswordInputChange = (field: keyof PasswordFormData, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswordForm()) {
      return
    }

    setIsPasswordLoading(true)
    setPasswordErrors({})

    try {
      const token = localStorage.getItem('loomsathi_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Check if API endpoint exists
      const testResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/change-password`, {
        method: 'OPTIONS',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(() => null)

      if (!testResponse || testResponse.status === 404) {
        // API endpoint doesn't exist, show demo message
        setPasswordErrors({ 
          general: 'Password change feature is not available yet. This is a demo mode.' 
        })
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to change password' }))
        throw new Error(errorData.message || 'Failed to change password')
      }

      // Clear form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      setIsPasswordSuccess(true)
      setTimeout(() => setIsPasswordSuccess(false), 3000)
      
    } catch (error) {
      console.error('Error changing password:', error)
      setPasswordErrors({ 
        general: error instanceof Error ? error.message : 'Failed to change password. Please try again later.' 
      })
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handleTwoFactorToggle = async () => {
    setIsTwoFactorLoading(true)
    
    try {
      const token = localStorage.getItem('loomsathi_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Check if API endpoint exists
      const testResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/toggle-2fa`, {
        method: 'OPTIONS',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(() => null)

      if (!testResponse || testResponse.status === 404) {
        // API endpoint doesn't exist, simulate toggle
        setTwoFactorEnabled(!twoFactorEnabled)
        alert('Two-factor authentication feature is in demo mode. This is a simulation.')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/toggle-2fa`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          enabled: !twoFactorEnabled
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to toggle 2FA' }))
        throw new Error(errorData.message || 'Failed to toggle 2FA')
      }

      setTwoFactorEnabled(!twoFactorEnabled)
      
    } catch (error) {
      console.error('Error toggling 2FA:', error)
      alert(error instanceof Error ? error.message : 'Failed to toggle 2FA. Please try again later.')
    } finally {
      setIsTwoFactorLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Password Change Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
            <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
          </div>
        </div>

        {/* Success Message */}
        {isPasswordSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg mb-6"
          >
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Password changed successfully!</span>
          </motion.div>
        )}

        {/* Error Message */}
        {passwordErrors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-6"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{passwordErrors.general}</span>
          </motion.div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  passwordErrors.currentPassword ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {passwordErrors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  passwordErrors.newPassword ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {passwordErrors.newPassword}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Password must be at least 8 characters, contain a lowercase letter, and a symbol
            </p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  passwordErrors.confirmPassword ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {passwordErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isPasswordLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPasswordLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isPasswordLoading ? 'Changing Password...' : 'Change Password'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">SMS Authentication</h4>
            <p className="text-sm text-gray-600">
              {twoFactorEnabled 
                ? 'Two-factor authentication is currently enabled' 
                : 'Two-factor authentication is currently disabled'
              }
            </p>
          </div>
          
          <button
            onClick={handleTwoFactorToggle}
            disabled={isTwoFactorLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              twoFactorEnabled ? 'bg-purple-600' : 'bg-gray-200'
            } ${isTwoFactorLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">How it works</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Receive a verification code via SMS</li>
            <li>• Enter the code when logging in</li>
            <li>• Enhanced security for your account</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default SecuritySettings 