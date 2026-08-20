'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/cn'

export function Device({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={cn('pointer-events-none select-none', className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    >
      {children}
    </motion.div>
  )
}
