/**
 * Soft radial light that follows the mouse (from copy repo LigitingCursor)
 * Tuned for Creativity light theme (#7C3AED).
 */
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function LightingCursor() {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springX = useSpring(cursorX, { damping: 28, stiffness: 220 });
  const springY = useSpring(cursorY, { damping: 28, stiffness: 220 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 160);
      cursorY.set(e.clientY - 160);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[6] h-[320px] w-[320px] rounded-full opacity-70"
      style={{
        x: springX,
        y: springY,
        background:
          "radial-gradient(circle, rgba(124, 58, 237, 0.22) 0%, rgba(183, 150, 230, 0.1) 40%, transparent 70%)",
        filter: "blur(28px)",
        mixBlendMode: "multiply",
      }}
    />
  );
}
