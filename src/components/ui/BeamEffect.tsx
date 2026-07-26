import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface BeamEffectProps {
  colors?: string[]
  intensity?: number
  speed?: number
  count?: number
}

export function BeamEffect({
  colors = ['#a855f7', '#b87df0', '#caa4ed'],
  intensity = 0.4,
  speed = 8,
  count = 5,
}: BeamEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawBeam = (
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      color: string,
      alpha: number,
      width: number
    ) => {
      ctx.beginPath()
      ctx.strokeStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(
        color.slice(5, 7),
        16
      )}, ${alpha})`
      ctx.lineWidth = width
      ctx.lineCap = 'round'
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.016 * speed

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + time * 0.5
        const radius = Math.min(canvas.width, canvas.height) * 0.4

        const startX = canvas.width / 2 + Math.cos(angle) * radius
        const startY = canvas.height / 2 + Math.sin(angle) * radius
        const endX = canvas.width / 2
        const endY = canvas.height / 2

        const colorIndex = i % colors.length
        const alpha = (Math.sin(time + i) * 0.5 + 0.5) * intensity

        drawBeam(startX, startY, endX, endY, colors[colorIndex], alpha, 2)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resize)
    resize()
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [colors, intensity, speed, count])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-[5] pointer-events-none opacity-60"
    />
  )
}
