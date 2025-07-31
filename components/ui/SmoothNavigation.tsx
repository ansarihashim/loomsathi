'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface SmoothNavigationProps {
  href: string
  children: ReactNode
  className?: string
  activeClassName?: string
  inactiveClassName?: string
  icon?: ReactNode
  onClick?: () => void
}

const SmoothNavigation = ({ 
  href, 
  children, 
  className = '',
  activeClassName = 'text-textile-600 bg-textile-50',
  inactiveClassName = 'text-gray-600 hover:text-textile-600 hover:bg-gray-50',
  icon,
  onClick
}: SmoothNavigationProps) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Link 
        href={href}
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
          isActive ? activeClassName : inactiveClassName
        } ${className}`}
      >
        {icon && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children}
        </motion.span>
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute right-2 w-2 h-2 bg-textile-500 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Link>
    </motion.div>
  )
}

export default SmoothNavigation 