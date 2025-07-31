'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ApiLoaderProps {
  isLoading: boolean
  message?: string
  size?: 'sm' | 'md' | 'lg'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
}

const ApiLoader = ({ 
  isLoading, 
  message = 'Loading data...', 
  size = 'md',
  position = 'top-right'
}: ApiLoaderProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className={`fixed z-50 ${positionClasses[position]} bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center space-x-3`}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className={`${sizeClasses[size]} text-textile-500`} />
          </motion.div>
          <motion.span 
            className="text-sm text-gray-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {message}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ApiLoader 