import {
  HTMLMotionProps,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationControls,
  useVelocity,
} from 'framer-motion'
import { ReactNode, useRef, useState, useCallback, useEffect } from 'react'
import { cn } from '../../lib/utils'

/* ─────────────────────────────────────────────────────────────
   PremiumDraggable V2 — Jelly physics drag-and-snap wrapper
   
   New in V2:
     • Jelly deformation: element stretches in drag direction
     • Velocity-based skew for organic rubber feel
     • Wobble oscillation on snap-back release
     • Softer, more luxurious spring physics
     • Distance-reactive glow aura
   ───────────────────────────────────────────────────────────── */

interface PremiumDraggableProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  intensity?: 'feather' | 'light' | 'normal' | 'heavy'
}

const presets = {
  feather: {
    elastic: 0.22,
    stiffness: 500,
    damping: 24,
    mass: 0.4,
    scaleUp: 1.025,
    tiltDeg: 2,
    jellyStretch: 0.04,
    jellySkew: 0.2,
    brighten: 1.04,
    glowDrag: '0 6px 24px -2px rgba(168, 85, 247,0.2), 0 0 8px rgba(168, 85, 247,0.12)',
  },
  light: {
    elastic: 0.3,
    stiffness: 380,
    damping: 18,
    mass: 0.55,
    scaleUp: 1.04,
    tiltDeg: 3,
    jellyStretch: 0.06,
    jellySkew: 0.3,
    brighten: 1.06,
    glowDrag: '0 10px 36px -4px rgba(168, 85, 247,0.24), 0 0 14px rgba(168, 85, 247,0.14)',
  },
  normal: {
    elastic: 0.4,
    stiffness: 280,
    damping: 14,
    mass: 0.8,
    scaleUp: 1.055,
    tiltDeg: 4.5,
    jellyStretch: 0.08,
    jellySkew: 0.45,
    brighten: 1.08,
    glowDrag: '0 16px 48px -6px rgba(168, 85, 247,0.3), 0 0 20px rgba(168, 85, 247,0.18)',
  },
  heavy: {
    elastic: 0.55,
    stiffness: 180,
    damping: 11,
    mass: 1.1,
    scaleUp: 1.07,
    tiltDeg: 6,
    jellyStretch: 0.1,
    jellySkew: 0.6,
    brighten: 1.10,
    glowDrag: '0 22px 64px -8px rgba(168, 85, 247,0.38), 0 0 32px rgba(168, 85, 247,0.24)',
  },
}

export function PremiumDraggable({
  children,
  className,
  intensity = 'normal',
  style,
  animate,
  whileHover,
  transition,
  onDragStart,
  onDragEnd,
  onDrag,
  ...rest
}: PremiumDraggableProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragEnabled, setDragEnabled] = useState(false)
  const controls = useAnimationControls()
  const cfg = presets[intensity]

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)')
    const updateDragAvailability = () => setDragEnabled(mediaQuery.matches)
    updateDragAvailability()
    mediaQuery.addEventListener('change', updateDragAvailability)
    return () => mediaQuery.removeEventListener('change', updateDragAvailability)
  }, [])

  /* ── Drag offset tracking ── */
  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)

  /* ── Velocity for jelly deformation ── */
  const velX = useVelocity(dragX)
  const velY = useVelocity(dragY)

  /* ── Jelly: velocity → skew (lagging squish) ── */
  const smoothVelX = useSpring(velX, { stiffness: 80, damping: 8, mass: 0.4 })
  const smoothVelY = useSpring(velY, { stiffness: 80, damping: 8, mass: 0.4 })
  const skewX = useTransform(smoothVelY, [-600, 600], [cfg.jellySkew * 16, -cfg.jellySkew * 16])
  const skewY = useTransform(smoothVelX, [-600, 600], [-cfg.jellySkew * 16, cfg.jellySkew * 16])

  /* ── Jelly: velocity → directional stretch ── */
  const speed = useTransform(
    [smoothVelX, smoothVelY],
    ([vx, vy]: number[]) => Math.sqrt(vx * vx + vy * vy)
  )
  const jellyScaleX = useTransform(
    [smoothVelX, speed],
    ([vx, spd]: number[]) => {
      const s = Math.min(spd, 500)
      return 1 + (Math.abs(vx) / (spd || 1)) * s * cfg.jellyStretch * 0.002
    }
  )
  const jellyScaleY = useTransform(
    [smoothVelY, speed],
    ([vy, spd]: number[]) => {
      const s = Math.min(spd, 500)
      return 1 + (Math.abs(vy) / (spd || 1)) * s * cfg.jellyStretch * 0.002
    }
  )

  /* ── 3D tilt follows drag direction ── */
  const smoothX = useSpring(dragX, { stiffness: 160, damping: 16, mass: 0.5 })
  const smoothY = useSpring(dragY, { stiffness: 160, damping: 16, mass: 0.5 })
  const rotateY = useTransform(smoothX, [-250, 250], [-cfg.tiltDeg, cfg.tiltDeg])
  const rotateX = useTransform(smoothY, [-300, 300], [cfg.tiltDeg, -cfg.tiltDeg])

  /* ── Glow aura reacts to drag distance ── */
  const dragDist = useTransform<number, number>(
    [smoothX, smoothY],
    ([x, y]: number[]) => Math.sqrt(x * x + y * y)
  )
  const glowOpacity = useTransform(dragDist, [0, 100], [0, 1])

  const handleDragStart = useCallback(
    (e: any, info: any) => {
      setIsDragging(true)
      onDragStart?.(e, info)
    },
    [onDragStart]
  )

  const handleDragEnd = useCallback(
    (e: any, info: any) => {
      setIsDragging(false)
      dragX.set(0)
      dragY.set(0)

      // Premium jelly wobble on release — dramatic oscillation
      controls.start({
        rotate: [0, -3, 2.5, -1.5, 0.8, -0.3, 0],
        scaleX: [1.06, 0.94, 1.04, 0.97, 1.015, 1],
        scaleY: [0.94, 1.06, 0.96, 1.03, 0.985, 1],
        skewX: [0, -1.5, 1, -0.5, 0],
        skewY: [0, 1, -0.8, 0.3, 0],
        transition: {
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        },
      })

      onDragEnd?.(e, info)
    },
    [onDragEnd, controls, dragX, dragY]
  )

  const handleDrag = useCallback(
    (e: any, info: any) => {
      dragX.set(info.offset.x)
      dragY.set(info.offset.y)
      onDrag?.(e, info)
    },
    [onDrag, dragX, dragY]
  )

  return (
    <motion.div
      {...rest}
      ref={ref}
      drag={dragEnabled}
      dragSnapToOrigin
      dragElastic={cfg.elastic}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      animate={controls}
      style={{
        ...style,
        rotateX,
        rotateY,
        skewX,
        skewY,
        scaleX: isDragging && dragEnabled ? jellyScaleX : undefined,
        scaleY: isDragging && dragEnabled ? jellyScaleY : undefined,
        touchAction: dragEnabled ? 'none' : 'pan-y',
        perspective: 1000,
        transformStyle: 'preserve-3d' as const,
      }}
      whileHover={
        dragEnabled
          ? {
              cursor: 'grab',
              scale: 1.01,
              ...(typeof whileHover === 'object' ? whileHover : {}),
            }
          : undefined
      }
      whileDrag={
        dragEnabled
          ? {
              scale: cfg.scaleUp,
              cursor: 'grabbing',
              filter: `brightness(${cfg.brighten})`,
              boxShadow: cfg.glowDrag,
              transition: { type: 'spring', stiffness: 400, damping: 25 },
            }
          : undefined
      }
      transition={{
        type: 'spring',
        stiffness: cfg.stiffness,
        damping: cfg.damping,
        mass: cfg.mass,
        ...(typeof transition === 'object' ? transition : {}),
      }}
      className={cn(
        'relative inline-block w-full will-change-transform',
        isDragging && 'z-50',
        className
      )}
    >
      {/* Glow aura — intensifies with drag distance */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-[-1]"
        style={{
          opacity: glowOpacity,
          boxShadow:
            '0 0 24px 6px rgba(168, 85, 247,0.16), inset 0 0 16px 2px rgba(168, 85, 247,0.1)',
        }}
      />
      {children}
    </motion.div>
  )
}
