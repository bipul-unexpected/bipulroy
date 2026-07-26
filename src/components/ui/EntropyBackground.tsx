"use client";
import { useEffect, useRef } from "react";

export function EntropyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    window.addEventListener("resize", resize);

    // Using our premium Dark Mode color palette
    const baseColor = "255, 255, 255"; // Soft white for Ordered structural web
    const chaosColor = "168, 85, 247"; // Brand Blue (#a855f7) for premium energy

    class Particle {
      x: number;
      y: number;
      size: number;
      order: boolean;
      velocity: { x: number; y: number };
      originalX: number;
      originalY: number;
      influence: number;
      neighbors: Particle[];

      constructor(x: number, y: number, order: boolean) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.size = order ? 1.5 : 2.5; // Chaos particles naturally larger
        this.order = order;
        this.velocity = {
          x: (Math.random() - 0.5) * 1.5,
          y: (Math.random() - 0.5) * 1.5,
        };
        this.influence = 0;
        this.neighbors = [];
      }

      update() {
        // --- Core Physics ---
        if (this.order) {
          // Ordered particles try to maintain formation but get distracted
          const dx = this.originalX - this.x;
          const dy = this.originalY - this.y;

          const chaosInfluence = { x: 0, y: 0 };
          if (this.neighbors) {
            this.neighbors.forEach((neighbor) => {
              if (!neighbor.order) {
                const distance = Math.hypot(
                  this.x - neighbor.x,
                  this.y - neighbor.y,
                );
                const strength = Math.max(0, 1 - distance / 120); // Chaos reach
                chaosInfluence.x += neighbor.velocity.x * strength;
                chaosInfluence.y += neighbor.velocity.y * strength;
                this.influence = Math.max(this.influence, strength);
              }
            });
          }

          // Blending rigid spring forces + chaotic influence
          this.x +=
            dx * 0.05 * (1 - this.influence) +
            chaosInfluence.x * this.influence;
          this.y +=
            dy * 0.05 * (1 - this.influence) +
            chaosInfluence.y * this.influence;
          this.influence *= 0.98; // Decay the chaos gradually
        } else {
          // Pure chaotic energy wandering the right side
          this.velocity.x += (Math.random() - 0.5) * 0.4;
          this.velocity.y += (Math.random() - 0.5) * 0.4;
          this.velocity.x *= 0.98; // gentle friction
          this.velocity.y *= 0.98;
          this.x += this.velocity.x;
          this.y += this.velocity.y;

          // Boundary checks for full screen active cluster
          if (this.x < 0 || this.x > width) this.velocity.x *= -1;
          if (this.y < 0 || this.y > height) this.velocity.y *= -1;
          this.x = Math.max(0, Math.min(width, this.x));
          this.y = Math.max(0, Math.min(height, this.y));
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        let alpha = 0;
        let colorStr = "";

        if (this.order) {
          alpha = Math.max(0.1, 0.4 - this.influence * 0.5);
          colorStr = `rgba(${baseColor}, ${alpha})`;
        } else {
          alpha = Math.max(
            0.2,
            (Math.abs(this.velocity.x) + Math.abs(this.velocity.y)) * 0.5,
          );
          colorStr = `rgba(${chaosColor}, ${Math.min(1, alpha)})`;
        }

        ctx.fillStyle = colorStr;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Add extreme premium glow to chaotic fast-moving particles
        if (!this.order && alpha > 0.4) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = `rgba(${chaosColor}, ${alpha})`;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }
    }

    let particles: Particle[] = [];

    function initParticles() {
      particles = [];
      // Tenser grid on mobile, wider on desktop
      const spacing = window.innerWidth < 768 ? 60 : 45;
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = spacing * i + spacing / 2 + (Math.random() * 10 - 5);
          const y = spacing * j + spacing / 2 + (Math.random() * 10 - 5);
          // Full screen active animation
          const order = false;
          particles.push(new Particle(x, y, order));
        }
      }
    }

    function updateNeighbors() {
      particles.forEach((particle) => {
        particle.neighbors = particles.filter((other) => {
          if (other === particle) return false;
          const distance = Math.hypot(
            particle.x - other.x,
            particle.y - other.y,
          );
          return distance < 100; // Connection threshold
        });
      });
    }

    let time = 0;
    let animationId: number;

    function animate() {
      // Premium motion blur effect (instead of rigid clearRect)
      ctx.fillStyle = "rgba(10, 10, 10, 0.3)";
      ctx.fillRect(0, 0, width, height);

      // Optimize collision tree loop (runs 4 times a second at 60fps)
      if (time % 15 === 0) {
        updateNeighbors();
      }

      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);

        // Quantum Connections
        particle.neighbors.forEach((neighbor) => {
          const distance = Math.hypot(
            particle.x - neighbor.x,
            particle.y - neighbor.y,
          );
          if (distance < 70) {
            // Dynamic color/weight scaling for chaotic interactions
            const isChaosLink = !particle.order || !neighbor.order;
            const color = isChaosLink ? chaosColor : baseColor;

            // Fades lines smoothly instead of snapping them
            const maxAlpha = isChaosLink ? 0.35 : 0.15;
            const alpha = maxAlpha * (1 - distance / 70);

            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = isChaosLink ? 1.2 : 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(neighbor.x, neighbor.y);
            ctx.stroke();
          }
        });
      });

      time++;
      animationId = requestAnimationFrame(animate);
    }

    // Initialize & Kickoff Loop
    resize();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        // Instantly premium visual fade preventing hard edges or footer bleeding
        maskImage: "linear-gradient(to bottom, black 50%, transparent 95%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 50%, transparent 95%)",
        background:
          "radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.03), transparent 70%)",
      }}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
