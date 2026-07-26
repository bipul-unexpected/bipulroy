import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { tallyFormId } from "../../data/portfolio";

const COLORS_TOP = [
  "var(--color-primary)",
  "var(--color-royalty-600)",
  "var(--color-royalty-400)",
  "var(--color-royalty-700)",
];

// Hex fallbacks for motion color animation (CSS vars don't animate in framer easily)
const COLORS_HEX = ["#7C3AED", "#A855F7", "#8F22F7", "#6112E8"];

export const AuroraHero = () => {
  const color = useMotionValue(COLORS_HEX[0]);
  const prefersReducedMotion = useReducedMotion();
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarsePointer(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const sync = () =>
      setIsLight(document.documentElement.classList.contains("light"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const controls = animate(color, COLORS_HEX, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
    return () => controls.stop();
  }, [color, prefersReducedMotion]);

  const starConfig = useMemo(
    () =>
      isCoarsePointer
        ? { radius: 40, count: 900, factor: 3, speed: 0.7 }
        : { radius: 50, count: 1800, factor: 4, speed: 1.2 },
    [isCoarsePointer],
  );

  const base = isLight ? "#FAF5FF" : "#1A0B2E";
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, ${base} 45%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative grid min-h-[70vh] place-content-center overflow-hidden px-4 py-24 text-foreground">
      <div className="relative z-10 flex flex-col items-center">
        <span className="mb-3 inline-block rounded-full border border-border bg-card/70 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur-md">
          Open to Collaboration · Full-Stack + DevOps
        </span>
        <h2
          className="max-w-3xl text-center text-3xl font-medium leading-tight text-foreground sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}>
          Let&apos;s build something the future remembers
        </h2>
        <p className="my-6 max-w-xl text-center text-base leading-relaxed text-muted-foreground md:text-lg md:leading-relaxed">
          From emotional UI/UX to production Kubernetes — design, code, motion,
          and scale in one partnership. Ready when you are.
        </p>
        <motion.button
          type="button"
          data-tally-open={tallyFormId}
          data-tally-layout="modal"
          data-tally-width="600"
          style={{ border, boxShadow }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.985 }}
          className="group relative flex w-fit items-center gap-1.5 rounded-full bg-card/80 px-5 py-2.5 text-foreground transition-colors hover:bg-card">
          Start your project
          <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
        </motion.button>
      </div>

      {!isLight && (
        <div className="absolute inset-0 z-0">
          <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: "low-power" }}
            camera={{ position: [0, 0, 1] }}>
            <Stars
              radius={starConfig.radius}
              count={starConfig.count}
              factor={starConfig.factor}
              fade
              speed={starConfig.speed}
            />
          </Canvas>
        </div>
      )}
    </motion.section>
  );
};
