import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GradientTextProps {
  children: ReactNode
  className?: string
  gradientStart?: string
  gradientEnd?: string
  animateGradient?: boolean
  duration?: number
}

export function GradientText({
  children,
  className = '',
  gradientStart = 'from-primary',
  gradientEnd = 'to-accent',
  animateGradient = true,
  duration = 4,
}: GradientTextProps) {
  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r ${gradientStart} via-primary ${gradientEnd} ${className}`}
      animate={
        animateGradient
          ? {
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }
          : {}
      }
      transition={
        animateGradient
          ? {
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : {}
      }
      style={{
        backgroundSize: animateGradient ? '200% 200%' : 'auto',
      }}
    >
      {children}
    </motion.span>
  )
}
