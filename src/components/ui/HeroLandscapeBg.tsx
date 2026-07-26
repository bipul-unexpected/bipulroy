/**
 * Shared hero landscape background from /hero-bg.jpg
 *
 * Image analysis: tranquil multi-tier East Asian mist landscape —
 * soft sage greens, slate-blue mountain ridges, pale sky, temple on rock,
 * pine silhouette. Atmosphere = calm, depth, fog.
 *
 * Synced with Creativity theme via lavender glass washes + animated fog sheets
 * so the photo reads as part of the UI language, not a stock wallpaper.
 */
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";

interface HeroLandscapeBgProps {
  className?: string;
  /** Stronger wash for text-heavy sections */
  intensity?: "hero" | "footer" | "cta";
  /** Slow parallax drift of the photo */
  animate?: boolean;
}

export function HeroLandscapeBg({
  className,
  intensity = "hero",
  animate = true,
}: HeroLandscapeBgProps) {
  const prefersReduced = useReducedMotion();

  const wash =
    intensity === "hero"
      ? // Let greens + mist read through while keeping readable text zones
        "bg-gradient-to-b from-[#FAF5FF]/78 via-[#FAF5FF]/42 to-[#FAF5FF]/88 dark:from-[#1E0549]/78 dark:via-[#1E0549]/48 dark:to-[#1E0549]/9"
      : intensity === "cta"
        ? "bg-gradient-to-b from-[#FAF5FF]/70 via-[#FAF5FF]/38 to-[#FAF5FF]/82 dark:from-[#1E0549]/72 dark:via-[#1E0549]/45 dark:to-[#1E0549]/88"
        : // footer — softer so landscape peeks under glass panel
          "bg-gradient-to-b from-[#FAF5FF]/82 via-[#FAF5FF]/55 to-[#FAF5FF]/92 dark:from-[#1E0549]/8 dark:via-[#1E0549]/55 dark:to-[#1E0549]/92";

  const bgPosition =
    intensity === "hero"
      ? "center 38%"
      : intensity === "cta"
        ? "center 50%"
        : "center 68%";

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden>
      {/* Base landscape photo */}
      <motion.div
        className="absolute inset-0 scale-105"
        style={{
          backgroundImage: "url(/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: bgPosition,
          backgroundRepeat: "no-repeat",
        }}
        animate={
          animate && !prefersReduced
            ? { scale: [1.05, 1.09, 1.05], x: [0, -6, 0], y: [0, 3, 0] }
            : undefined
        }
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Brand color wash — Creativity purple identity over the mist scene */}
      <div className={cn("absolute inset-0", wash)} />

      {/* Soft purple mist veils matching the photo's fog layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_45%,rgba(124,58,237,0.1),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_65%,rgba(183,150,230,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(250,245,255,0.35),transparent_45%)]" />

      {/* Animated liquid-glass fog sheets — echo the mountain mist */}
      {!prefersReduced && (
        <>
          <motion.div
            className="absolute -left-1/4 top-[18%] h-[55%] w-[75%] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(255,255,255,0.38) 0%, transparent 70%)",
              filter: "blur(44px)",
            }}
            animate={{ x: [0, 36, 0], opacity: [0.22, 0.48, 0.22] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-1/4 bottom-[15%] h-[48%] w-[65%] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(124,58,237,0.11) 0%, transparent 70%)",
              filter: "blur(52px)",
            }}
            animate={{ x: [0, -28, 0], opacity: [0.18, 0.4, 0.18] }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
          />
          <motion.div
            className="absolute left-1/3 bottom-0 h-[32%] w-[55%] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(250,245,255,0.55) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
            animate={{ y: [0, -18, 0], opacity: [0.28, 0.52, 0.28] }}
            transition={{
              duration: 13,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          />
          {/* Thin horizontal mist band — like valley fog in the photo */}
          <motion.div
            className="absolute left-0 right-0 top-[42%] h-24"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
              filter: "blur(20px)",
            }}
            animate={{ opacity: [0.15, 0.4, 0.15], x: ["-5%", "5%", "-5%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Bottom fade into page flow */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
