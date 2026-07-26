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

// No scroll-linked Y movement — it fights nav scrollIntoView (target keeps moving).
// Reveal uses opacity + scale only for a stable layout box.
const yDriftMap: Record<RevealTone, [number, number]> = {
  lift: [0, 0],
  "glide-left": [0, 0],
  "glide-right": [0, 0],
  curtain: [0, 0],
  depth: [0, 0],
  float: [0, 0],
  vault: [0, 0],
};

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
    offset: ["start 94%", "end 8%"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 34,
    mass: 0.35,
  });

  const y = useTransform(progress, [0, 1], yDriftMap[tone]);
  const opacity = useTransform(progress, [0, 0.2, 1], [0.52, 1, 1]);
  const scale = useTransform(progress, [0, 0.25, 1], [0.98, 1, 1]);
  
  const glowOpacity = useTransform(progress, [0, 0.28, 1], usePerformanceMode ? [0, 0, 0] : [0, 0.45, 0.12]);
  const lineOpacity = useTransform(progress, [0, 0.2, 1], usePerformanceMode ? [0, 0, 0] : [0, 0.6, 0.12]);

  const animatedPanelStyle = {
    scale,
    y,
    opacity
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}>
      <motion.div style={animatedPanelStyle} className="relative">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-10 -top-8 h-20 rounded-full bg-[radial-gradient(circle,rgba(168, 85, 247,0.12)_0%,rgba(168, 85, 247,0)_72%)] blur-2xl"
          style={{ opacity: glowOpacity }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent"
          style={{ opacity: lineOpacity }}
        />
        {children}
      </motion.div>
    </motion.div>
  );
}
