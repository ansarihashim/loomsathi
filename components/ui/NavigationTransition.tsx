'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface NavigationTransitionProps {
  children: ReactNode
  isVisible: boolean
  className?: string
  type?: 'slide' | 'fade' | 'scale'
  direction?: 'left' | 'right' | 'up' | 'down'
}

const NavigationTransition = ({ 
  children, 
  isVisible, 
  className = '',
  type = 'slide',
  direction = 'left'
}: NavigationTransitionProps) => {
  const getVariants = () => {
    switch (type) {
      case 'slide':
        const slideVariants = {
          hidden: {
            x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
            y: direction === 'up' ? -300 : direction === 'down' ? 300 : 0,
            opacity: 0
          },
          visible: {
            x: 0,
            y: 0,
            opacity: 1
          },
          exit: {
            x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
            y: direction === 'up' ? -300 : direction === 'down' ? 300 : 0,
            opacity: 0
          }
        }
        return slideVariants

      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 }
        }

      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 }
        }

      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 }
        }
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={getVariants()}
          transition={{
            type: 'tween',
            ease: 'easeInOut',
            duration: 0.3
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NavigationTransition 