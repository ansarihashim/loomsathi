import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

const Card: React.FC<CardProps> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default Card 