import { motion, type Transition } from "framer-motion";
import { useMemo, type ReactNode } from "react";

interface TextAnimateProps {
  children: ReactNode;
  animation?:
    | "blurInUp"
    | "blurInDown"
    | "blurInLeft"
    | "blurInRight"
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "scaleIn";
  by?: "character" | "word" | "line";
  duration?: number;
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

/** Coerce any React children into a plain string for animation. */
function childrenToText(children: ReactNode): string {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (typeof children === "bigint") return String(children);
  if (Array.isArray(children)) {
    return children.map((child) => childrenToText(child)).join("");
  }
  // React elements / unexpected values — never crash the whole app
  return "";
}

const getAnimationVariants = (
  animation: string,
  duration: number,
  segments: string[],
  staggerDelay: number,
  delay: number,
) => {
  const baseConfigs: Record<string, Record<string, string | number>> = {
    blurInUp: { y: 20, filter: "blur(10px)" },
    blurInDown: { y: -20, filter: "blur(10px)" },
    blurInLeft: { x: -20, filter: "blur(10px)" },
    blurInRight: { x: 20, filter: "blur(10px)" },
    fadeIn: {},
    slideUp: { y: 20 },
    slideDown: { y: -20 },
    scaleIn: { scale: 0.8 },
  };

  const initial = baseConfigs[animation] || {};
  const itemTransition: Transition = {
    duration: duration / (segments.length || 1),
  };

  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delay,
        },
      },
    },
    item: {
      hidden: { opacity: 0, ...initial },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: itemTransition,
      },
    },
  };
};

function splitText(text: string, by: string): string[] {
  const safe = typeof text === "string" ? text : String(text ?? "");
  if (!safe) return [""];
  if (by === "character") return safe.split("");
  if (by === "word") return safe.split(/\s+/).filter(Boolean);
  if (by === "line") return safe.split("\n");
  return safe.split("");
}

export function TextAnimate({
  children,
  animation = "blurInUp",
  by = "character",
  duration = 1,
  delay = 0,
  staggerDelay = 0.02,
  className = "",
}: TextAnimateProps) {
  const text = useMemo(() => childrenToText(children), [children]);
  const segments = useMemo(() => splitText(text, by), [text, by]);
  const variants = getAnimationVariants(
    animation,
    duration,
    segments,
    staggerDelay,
    delay,
  );

  return (
    <motion.span
      variants={variants.container}
      initial="hidden"
      animate="visible"
      className={className}>
      {segments.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          variants={variants.item}
          style={{
            display: by === "line" ? "block" : "inline",
            whiteSpace: by === "word" ? "pre-wrap" : "normal",
          }}>
          {segment === " " ? "\u00A0" : segment}
          {by === "word" && index < segments.length - 1 ? " " : null}
          {by === "line" && index < segments.length - 1 ? <br /> : null}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default TextAnimate;
