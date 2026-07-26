import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface ParticleTrailProps {
  color?: string
  count?: number
  life?: number
  speed?: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

export function ParticleTrail({
  color = '#a855f7',
  count = 50,
  life = 1000,
  speed = 2,
}: ParticleTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }

      // Create particles at mouse position
      for (let i = 0; i < 3; i++) {
        if (particlesRef.current.length < count) {
          particlesRef.current.push({
            x: e.clientX,
            y: e.clientY,
            vx: (Math.random() - 0.5) * speed * 4,
            vy: (Math.random() - 0.5) * speed * 4,
            life: 0,
            maxLife: life,
          })
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life += 16
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.1 // gravity

        const alpha = 1 - p.life / p.maxLife

        const [r, g, b] = [
          parseInt(color.slice(1, 3), 16),
          parseInt(color.slice(3, 5), 16),
          parseInt(color.slice(5, 7), 16),
        ]

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fill()

        return p.life < p.maxLife
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('resize', resize)
    resize()
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [color, count, life, speed])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-[3] pointer-events-none" />
}
