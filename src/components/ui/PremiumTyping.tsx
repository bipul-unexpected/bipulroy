import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface PremiumTypingProps {
  text: string
  speed?: number
  delay?: number
  cursor?: boolean
  onComplete?: () => void
  className?: string
  cursorClassName?: string
}

export function PremiumTyping({
  text,
  speed = 30,
  delay = 0,
  cursor = true,
  onComplete,
  className = '',
  cursorClassName = '',
}: PremiumTypingProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let charIndex = 0

    const typeNextChar = () => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1))
        charIndex++
        timeout = setTimeout(typeNextChar, speed)
      } else {
        setIsComplete(true)
        if (onComplete) onComplete()
      }
    }

    if (delay > 0) {
      timeout = setTimeout(typeNextChar, delay)
    } else {
      typeNextChar()
    }

    return () => clearTimeout(timeout)
  }, [text, speed, delay, onComplete])

  return (
    <span className={className}>
      {displayedText}
      <AnimatePresence>
        {cursor && !isComplete && (
          <motion.span
            className={`inline-block w-[2px] h-[1.2em] bg-primary ml-1 align-middle ${cursorClassName}`}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </AnimatePresence>
    </span>
  )
}

export default PremiumTyping
