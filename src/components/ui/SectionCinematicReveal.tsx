/**
 * Section reveal — clean fade/scale only (no Y drift so nav stays accurate).
 * Tuned for Creativity light liquid-glass portfolio.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "../../lib/utils";

type RevealTone =
  | "lift"
  | "glide-left"
  | "glide-right"
  | "curtain"
  | "depth"
  | "float"
  | "vault";

interface SectionCinematicRevealProps {
  children: ReactNode;
  tone?: RevealTone;
  className?: string;
}

export function SectionCinematicReveal({
  children,
  tone = "lift",
  className,
}: SectionCinematicRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarsePointer(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const usePerformanceMode = prefersReducedMotion || isCoarsePointer;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 12%"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  // Keep sections fully readable — start near opaque so light theme never looks broken
  const opacity = useTransform(
    progress,
    [0, 0.15, 1],
    usePerformanceMode ? [1, 1, 1] : [0.88, 1, 1],
  );
  const scale = useTransform(
    progress,
    [0, 0.2, 1],
    usePerformanceMode ? [1, 1, 1] : [0.992, 1, 1],
  );
  const glowOpacity = useTransform(
    progress,
    [0, 0.25, 1],
    usePerformanceMode ? [0, 0, 0] : [0, 0.35, 0.08],
  );
  const lineOpacity = useTransform(
    progress,
    [0, 0.2, 1],
    usePerformanceMode ? [0, 0, 0] : [0, 0.55, 0.1],
  );

  // silence unused tone warning — reserved for future variants
  void tone;

  return (
    <motion.div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ scale, opacity }} className="relative">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-10 -top-8 h-20 rounded-full blur-2xl"
          style={{
            opacity: glowOpacity,
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 16%, transparent) 0%, transparent 72%)",
          }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          style={{ opacity: lineOpacity }}
        />
        {children}
      </motion.div>
    </motion.div>
  );
}
