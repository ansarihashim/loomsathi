'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Moon, 
  Sun,
  Palette,
  Monitor,
  Smartphone,
  Check,
  AlertCircle
} from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface AppearanceSettingsProps {
  user: any
}

const AppearanceSettings = ({ user }: AppearanceSettingsProps) => {
  const { isDarkMode, toggleDarkMode, setDarkMode } = useDarkMode()
  const [isLoading, setIsLoading] = useState(false)

  const handleThemeChange = async (theme: 'light' | 'dark' | 'auto') => {
    setIsLoading(true)
    
    try {
      // Simulate API call for theme preference
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (theme === 'auto') {
        // Auto theme based on system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setDarkMode(prefersDark)
      } else {
        setDarkMode(theme === 'dark')
      }
      
    } catch (error) {
      console.error('Error changing theme:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const themes = [
    {
      id: 'light',
      name: 'Light',
      description: 'Clean and bright interface',
      icon: Sun,
      active: !isDarkMode,
      color: 'bg-yellow-500'
    },
    {
      id: 'dark',
      name: 'Dark',
      description: 'Easy on the eyes in low light',
      icon: Moon,
      active: isDarkMode,
      color: 'bg-gray-800'
    },
    {
      id: 'auto',
      name: 'Auto',
      description: 'Follows your system preference',
      icon: Monitor,
      active: false, // Auto is never "active" in the traditional sense
      color: 'bg-blue-500'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Theme Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme Settings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred interface theme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => {
            const IconComponent = theme.icon
            return (
              <motion.button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id as 'light' | 'dark' | 'auto')}
                disabled={isLoading}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                  theme.active
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${theme.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">{theme.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{theme.description}</p>
                  </div>
                </div>
                
                {theme.active && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dark Mode</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark mode for better viewing experience</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isDarkMode 
                ? 'Dark mode is currently enabled' 
                : 'Dark mode is currently disabled'
              }
            </p>
          </div>
          
          <button
            onClick={toggleDarkMode}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              isDarkMode ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-600'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Benefits of Dark Mode</h5>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Reduces eye strain in low-light environments</li>
            <li>• Saves battery on OLED displays</li>
            <li>• Provides better contrast for content</li>
            <li>• Modern and sleek appearance</li>
          </ul>
        </div>
      </div>

      {/* Responsive Design Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Responsive Design</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Optimized for all screen sizes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">Mobile</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">320px - 768px</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Monitor className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">Tablet</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">768px - 1024px</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Monitor className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">Desktop</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">1024px+</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AppearanceSettings 