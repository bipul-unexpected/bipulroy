/**
 * Bottom CTA section — same hero-bg landscape + liquid glass floating panels
 * Keeps visual continuity from hero to footer.
 */
import { useReducedMotion, motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { tallyFormId } from "../../data/portfolio";
import { HeroLandscapeBg } from "../ui/HeroLandscapeBg";
import { BorderBeam } from "../ui/BorderBeam";

export const AuroraHero = () => {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative grid min-h-[75vh] place-content-center overflow-hidden px-4 py-24 text-foreground">
      {/* Same landscape as hero — synced visual language */}
      <HeroLandscapeBg intensity="cta" />

      {/* Floating liquid-glass orbs — translucent motion over mist */}
      {!prefersReduced && (
        <>
          <motion.div
            className="pointer-events-none absolute left-[8%] top-[20%] h-40 w-40 rounded-full liquid-glass opacity-60"
            animate={{ y: [0, -24, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute right-[10%] bottom-[18%] h-52 w-52 rounded-full liquid-glass opacity-50"
            animate={{ y: [0, 20, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />
          <motion.div
            className="pointer-events-none absolute left-[45%] top-[12%] h-24 w-24 rounded-full liquid-glass opacity-40"
            animate={{ y: [0, -16, 0], x: [0, 12, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.div
            className="pointer-events-none absolute right-[28%] top-[35%] h-16 w-16 rounded-full liquid-glass opacity-35"
            animate={{ y: [0, 14, 0], x: [0, -8, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
          />
        </>
      )}

      {/* Main liquid glass CTA panel */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto w-full max-w-2xl">
        <div className="relative overflow-hidden rounded-[2rem] liquid-glass-strong px-6 py-10 sm:px-10 sm:py-12 text-center shadow-lg">
          <BorderBeam size={220} duration={10} />

          {/* Inner animated glass shimmer */}
          {!prefersReduced && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
              }}
              animate={{ x: ["-60%", "120%"] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            />
          )}

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="relative mb-4 inline-flex items-center gap-2 rounded-full liquid-glass px-3.5 py-1.5 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Open to Collaboration · Full-Stack + DevOps
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="relative max-w-xl mx-auto text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}>
            Let&apos;s build something the future remembers
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="relative my-6 mx-auto max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            From calm UI craft to production Kubernetes — design, code, motion,
            and scale in one partnership. Ready when you are.
          </motion.p>

          <motion.button
            type="button"
            data-tally-open={tallyFormId}
            data-tally-layout="modal"
            data-tally-width="600"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary-glow group relative inline-flex w-fit items-center gap-2 rounded-full px-7 py-3 text-sm font-bold shadow-lg">
            Start your project
            <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
          </motion.button>

          {/* Floating mini glass chips */}
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-2">
            {["React", "Django", "Kubernetes", "UI/UX"].map((tag, i) => (
              <motion.span
                key={tag}
                className="rounded-full liquid-glass px-3 py-1 text-[11px] font-semibold text-foreground/80"
                animate={
                  prefersReduced
                    ? undefined
                    : { y: [0, -4, 0] }
                }
                transition={{
                  duration: 3 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}>
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
