/**
 * Clean premium Full-Stack Hero
 * Motion: staggered entrance, floating orbs, magnetic CTAs, live role swap, terminal identity
 */
import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import type { ComponentProps } from "react";
import {
  ArrowRight,
  ChevronDown,
  MapPin,
  Sparkles,
  Code2,
  Server,
  Cloud,
} from "lucide-react";
import { FiSend } from "react-icons/fi";
import { profile, socialLinks, tallyFormId } from "../../data/portfolio";
import { TextAnimate } from "../ui/TextAnimate";
import { MouseSpotlight, Spotlight } from "../ui/Spotlight";
import { InfiniteMarquee } from "../ui/InfiniteMarquee";
import { TerminalCard } from "../ui/TerminalCard";
import { GitHubIcon } from "../ui/SocialIcons";
import { scrollToSection } from "../../lib/scrollToSection";

const easeOut = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const itemUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 70, damping: 16 },
  },
};

const valueProps = [
  { icon: Code2, title: "Frontend", desc: "React · Next · Motion" },
  { icon: Server, title: "Backend", desc: "Node · Django · APIs" },
  { icon: Cloud, title: "DevOps", desc: "Docker · K8s · CI/CD" },
];

const marqueeStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Django",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "GraphQL",
  "Figma",
  "Three.js",
];

function RoleRotator({ roles }: { roles: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(
      () => setIndex((p) => (p + 1) % roles.length),
      2800,
    );
    return () => clearInterval(id);
  }, [roles.length, prefersReducedMotion]);

  return (
    <span className="relative inline-flex h-[1.4em] min-w-[15ch] items-center overflow-hidden align-bottom sm:min-w-[18ch]">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          initial={{ y: 20, opacity: 0, filter: "blur(8px)", scale: 0.96 }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ y: -18, opacity: 0, filter: "blur(8px)", scale: 0.98 }}
          transition={{ duration: 0.45, ease: easeOut }}
          className="absolute inset-x-0 text-gradient-theme font-semibold">
          {roles[index]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible font-semibold" aria-hidden>
        DevOps Architect
      </span>
    </span>
  );
}

function FloatingOrb({
  className,
  delay = 0,
  duration = 10,
}: {
  className: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -18, 0, 12, 0],
        x: [0, 10, 0, -8, 0],
        scale: [1, 1.08, 1, 0.96, 1],
        opacity: [0.35, 0.55, 0.4, 0.5, 0.35],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function MagneticButton({
  children,
  className,
  onClick,
  href,
  ...rest
}: ComponentProps<"a">) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 18 });
  const springY = useSpring(y, { stiffness: 280, damping: 18 });

  return (
    <motion.a
      href={href}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={className}
      {...rest}>
      {children}
    </motion.a>
  );
}

export function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-28 sm:pt-32 pb-20 overflow-hidden bg-background">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-16 md:-top-16" />
        <MouseSpotlight />

        <FloatingOrb
          className="absolute -top-10 right-[8%] h-64 w-64 rounded-full bg-primary/20 blur-[90px]"
          delay={0}
          duration={11}
        />
        <FloatingOrb
          className="absolute bottom-[12%] left-[5%] h-72 w-72 rounded-full bg-primary/15 blur-[100px]"
          delay={1.2}
          duration={13}
        />
        <FloatingOrb
          className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[color-mix(in_srgb,var(--color-royalty-300)_20%,transparent)] blur-[80px]"
          delay={0.6}
          duration={9}
        />

        {/* Soft grid */}
        <div
          className="absolute inset-0 opacity-[0.28] dark:opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 65% 55% at 50% 42%, black 15%, transparent 72%)",
          }}
        />

        {/* Floating particles */}
        {!prefersReduced &&
          Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-primary/60"
              style={{
                left: `${12 + i * 10}%`,
                top: `${20 + (i % 4) * 15}%`,
              }}
              animate={{
                y: [0, -24 - i * 2, 0],
                opacity: [0.15, 0.7, 0.15],
                scale: [1, 1.6, 1],
              }}
              transition={{
                duration: 4 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.35,
                ease: "easeInOut",
              }}
            />
          ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="grid lg:grid-cols-[1.12fr_0.88fr] gap-12 lg:gap-14 items-center">
          {/* Left column */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start text-left">
            <motion.div
              variants={itemUp}
              className="mb-7 inline-flex flex-wrap items-center gap-2.5 rounded-full liquid-glass px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
              </span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Open to work
              </span>
              <span className="hidden sm:inline h-3 w-px bg-border" />
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3 text-primary" />
                {profile.location}
              </span>
            </motion.div>

            <motion.p
              variants={itemUp}
              className="mb-2 text-sm sm:text-base text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}>
              Hi, I&apos;m{" "}
              <motion.span
                className="inline-block font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
                animate={{
                  textShadow: [
                    "0 0 0px transparent",
                    "0 0 24px color-mix(in srgb, var(--color-primary) 45%, transparent)",
                    "0 0 0px transparent",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                {profile.name}
              </motion.span>
            </motion.p>

            <motion.div
              variants={itemUp}
              className="mb-5 flex flex-wrap items-center gap-2 text-sm sm:text-base text-muted-foreground">
              <motion.span
                animate={{ rotate: [0, 12, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                <Sparkles className="h-4 w-4 text-primary" />
              </motion.span>
              <span>I am a</span>
              <RoleRotator roles={profile.roles} />
            </motion.div>

            <motion.h1
              variants={itemUp}
              className="max-w-xl text-[2.05rem] sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] tracking-[-0.025em] text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}>
              <TextAnimate
                animation="blurInUp"
                by="word"
                duration={1.6}
                staggerDelay={0.055}
                className="inline">
                Full-stack products people trust —
              </TextAnimate>{" "}
              <span className="text-gradient-theme">
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  duration={1.6}
                  delay={0.3}
                  staggerDelay={0.055}
                  className="inline">
                  systems that scale.
                </TextAnimate>
              </span>
            </motion.h1>

            <motion.p
              variants={itemUp}
              className="mt-5 max-w-md text-[15px] sm:text-base leading-[1.75] text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}>
              Pixel-perfect UI, solid APIs, and calm Kubernetes deploys — I ship
              end-to-end web platforms that feel premium and hold up in
              production.
            </motion.p>

            <motion.div
              variants={itemUp}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-foreground">
                {profile.philosophy}
              </span>
            </motion.div>

            <motion.div
              variants={itemUp}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <MagneticButton
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("#projects");
                }}
                className="btn-primary-glow group inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold border border-primary/25 cursor-pointer shadow-royalty"
                style={{ fontFamily: "var(--font-heading)" }}>
                View my work
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>

              <MagneticButton
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("#contact");
                }}
                data-tally-open={tallyFormId}
                data-tally-layout="modal"
                data-tally-width="600"
                className="group liquid-glass inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-foreground transition-colors hover:border-primary/40 cursor-pointer"
                style={{ fontFamily: "var(--font-heading)" }}>
                <FiSend className="h-4 w-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                Let&apos;s build
              </MagneticButton>

              <motion.a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.06, rotate: -4 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-transparent px-4 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-primary/30"
                aria-label="GitHub">
                <GitHubIcon className="h-4 w-4" />
              </motion.a>
            </motion.div>

          </motion.div>

          {/* Right column */}
          <div className="relative flex flex-col items-center lg:items-end gap-5">
            <motion.div
              className="relative w-full max-w-md"
              animate={
                prefersReduced
                  ? undefined
                  : { y: [0, -10, 0] }
              }
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}>
              {/* Glow behind terminal */}
              <motion.div
                className="absolute -inset-6 rounded-[2rem] bg-primary/15 blur-3xl"
                animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.98, 1.04, 0.98] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <TerminalCard className="w-full relative z-10" />
            </motion.div>

            <div className="grid grid-cols-3 gap-2.5 w-full max-w-md">
              {valueProps.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 20, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.85 + i * 0.1,
                      type: "spring",
                      stiffness: 120,
                      damping: 14,
                    }}
                    whileHover={{
                      y: -6,
                      boxShadow:
                        "0 16px 40px -12px color-mix(in srgb, var(--color-primary) 35%, transparent)",
                    }}
                    className="rounded-2xl liquid-glass p-3.5 text-center cursor-default">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        duration: 2.8 + i * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                      }}>
                      <Icon className="mx-auto h-4 w-4 text-primary mb-1.5" />
                    </motion.div>
                    <div className="text-[11px] font-bold text-foreground leading-tight">
                      {v.title}
                    </div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
                      {v.desc}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.7, ease: easeOut }}
          className="mt-14 sm:mt-16">
          <p className="mb-3 text-center text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
            Stack I ship with
          </p>
          <InfiniteMarquee items={marqueeStack} speed="normal" />
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}>
        <span className="text-[9px] font-bold tracking-[0.32em] uppercase text-muted-foreground">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="h-3.5 w-3.5 text-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
