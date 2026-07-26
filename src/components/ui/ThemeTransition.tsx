/**
 * ThemeTransition — premium circular reveal when switching light/dark.
 * Expands from the toggle click point with royalty purple / soft lavender.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type ThemeRipple = {
  x: number;
  y: number;
  toDark: boolean;
  id: number;
};

interface ThemeTransitionProps {
  ripple: ThemeRipple | null;
  onMidpoint?: () => void;
  onComplete?: () => void;
}

export function ThemeTransition({
  ripple,
  onMidpoint,
  onComplete,
}: ThemeTransitionProps) {
  const prefersReduced = useReducedMotion();

  if (!ripple) return null;

  // Cover diagonal of viewport so the circle fully fills the screen
  const size =
    typeof window !== "undefined"
      ? Math.hypot(window.innerWidth, window.innerHeight) * 2.2
      : 3000;

  const fill = ripple.toDark ? "#1A0B2E" : "#FAF5FF";
  const glow = ripple.toDark ? "#A855F7" : "#7C3AED";

  return (
    <AnimatePresence>
      <motion.div
        key={ripple.id}
        className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onAnimationComplete={onComplete}>
        {/* Soft flash */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${ripple.x}px ${ripple.y}px, ${glow}55, transparent 45%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{ duration: prefersReduced ? 0.2 : 0.7, ease: "easeOut" }}
        />

        {/* Expanding royalty orb */}
        <motion.div
          className="absolute rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
            background: `radial-gradient(circle, ${glow} 0%, ${fill} 42%, ${fill} 100%)`,
            boxShadow: `0 0 80px 20px ${glow}66`,
          }}
          initial={{ scale: 0, opacity: 0.95 }}
          animate={{ scale: 1, opacity: [0.95, 1, 0] }}
          transition={{
            duration: prefersReduced ? 0.25 : 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
          onUpdate={(latest) => {
            // Fire theme swap once mid-expansion
            if (typeof latest.scale === "number" && latest.scale >= 0.4) {
              onMidpoint?.();
            }
          }}
        />

        {/* Spark rings */}
        {!prefersReduced &&
          [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 40 + i * 28,
                height: 40 + i * 28,
                marginLeft: -(20 + i * 14),
                marginTop: -(20 + i * 14),
                borderColor: glow,
              }}
              initial={{ scale: 0.2, opacity: 0.7 }}
              animate={{ scale: 4 + i * 1.2, opacity: 0 }}
              transition={{
                duration: 0.7,
                delay: i * 0.06,
                ease: "easeOut",
              }}
            />
          ))}
      </motion.div>
    </AnimatePresence>
  );
}
