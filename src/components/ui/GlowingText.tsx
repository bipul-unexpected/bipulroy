import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowingTextProps {
  children: ReactNode;
  className?: string;
  color?: "blue" | "purple" | "cyan" | "royalty";
  intensity?: "light" | "medium" | "heavy";
  animateGlow?: boolean;
}

const colorMap = {
  royalty: {
    light: "text-royalty-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    medium: "text-royalty-500 shadow-[0_0_40px_rgba(168,85,247,0.5)]",
    heavy: "text-royalty-400 shadow-[0_0_60px_rgba(168,85,247,0.75)]",
  },
  blue: {
    light: "text-royalty-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    medium: "text-primary shadow-[0_0_40px_rgba(168,85,247,0.5)]",
    heavy: "text-primary shadow-[0_0_60px_rgba(168,85,247,0.8)]",
  },
  purple: {
    light: "text-royalty-300 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    medium: "text-royalty-400 shadow-[0_0_40px_rgba(168,85,247,0.5)]",
    heavy: "text-royalty-500 shadow-[0_0_60px_rgba(168,85,247,0.8)]",
  },
  cyan: {
    light: "text-royalty-200 shadow-[0_0_20px_rgba(202,164,237,0.3)]",
    medium: "text-royalty-300 shadow-[0_0_40px_rgba(202,164,237,0.5)]",
    heavy: "text-royalty-300 shadow-[0_0_60px_rgba(202,164,237,0.7)]",
  },
};

const glowRgb: Record<string, string> = {
  royalty: "168,85,247",
  blue: "168,85,247",
  purple: "143,34,247",
  cyan: "202,164,237",
};

export function GlowingText({
  children,
  className = "",
  color = "royalty",
  intensity = "medium",
  animateGlow = true,
}: GlowingTextProps) {
  const glowClass = colorMap[color][intensity];
  const rgb = glowRgb[color];

  return (
    <motion.span
      className={`inline-block relative ${glowClass} ${className}`}
      animate={
        animateGlow
          ? {
              opacity: [0.85, 1, 0.85],
              textShadow: [
                `0 0 20px rgba(${rgb},0.3)`,
                `0 0 40px rgba(${rgb},0.6)`,
                `0 0 20px rgba(${rgb},0.3)`,
              ],
            }
          : {}
      }
      transition={
        animateGlow
          ? {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : {}
      }>
      {children}
    </motion.span>
  );
}
