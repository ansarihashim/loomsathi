'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ProgressBarProps {
  isLoading: boolean
  className?: string
}

const ProgressBar = ({ isLoading, className = '' }: ProgressBarProps) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      setProgress(0)
      const timer = setTimeout(() => setProgress(30), 100)
      const timer2 = setTimeout(() => setProgress(60), 300)
      const timer3 = setTimeout(() => setProgress(90), 600)
      
      return () => {
        clearTimeout(timer)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    } else {
      setProgress(100)
      const timer = setTimeout(() => setProgress(0), 200)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={`fixed top-0 left-0 right-0 z-50 h-1 bg-textile-500 ${className}`}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: progress / 100, opacity: 1 }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ transformOrigin: 'left' }}
        />
      )}
    </AnimatePresence>
  )
}

export default ProgressBar 