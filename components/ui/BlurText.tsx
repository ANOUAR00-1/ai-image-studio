'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface BlurTextProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function BlurText({ children, className = '', delay = 0 }: BlurTextProps) {
  return (
    <motion.div
      initial={{ filter: 'blur(10px)', opacity: 0 }}
      animate={{ filter: 'blur(0px)', opacity: 1 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}