'use client'

import { motion } from 'framer-motion'
import { ReactNode, memo } from 'react'

interface OptimizedPageWrapperProps {
  children: ReactNode
  className?: string
  animationDisabled?: boolean
}

/**
 * Optimized page wrapper with optional animations
 * Use animationDisabled=true for pages that don't need entrance animations
 */
const OptimizedPageWrapper = memo(({ 
  children, 
  className = '', 
  animationDisabled = false 
}: OptimizedPageWrapperProps) => {
  if (animationDisabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  )
})

OptimizedPageWrapper.displayName = 'OptimizedPageWrapper'

export default OptimizedPageWrapper
