'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface DataFetchingAnimationProps {
  children: ReactNode
  isLoading: boolean
  className?: string
  loadingComponent?: ReactNode
}

const DataFetchingAnimation = ({ 
  children, 
  isLoading, 
  className = '',
  loadingComponent
}: DataFetchingAnimationProps) => {
  const defaultLoadingComponent = (
    <motion.div 
      className="flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="animate-spin rounded-full h-8 w-8 border-b-2 border-textile-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.span 
        className="ml-3 text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Loading data...
      </motion.span>
    </motion.div>
  )

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={className}
        >
          {loadingComponent || defaultLoadingComponent}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DataFetchingAnimation 