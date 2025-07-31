'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { pageTransitions, pageTransitionConfig } from '@/config/animations'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

const PageTransition = ({ children, className = '' }: PageTransitionProps) => {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageTransitions}
        transition={pageTransitionConfig}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition 