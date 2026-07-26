import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Download, CheckCircle2 } from "lucide-react";
import { PremiumDraggable } from "../ui/PremiumDraggable";
import { TextAnimate } from "../ui/TextAnimate";
import { aboutHighlights, profile, socialLinks } from "../../data/portfolio";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 18 },
  },
};

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 md:py-32" ref={ref}>
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}>
          <motion.div variants={fadeUp} className="mb-14 md:mb-16">
            <PremiumDraggable intensity="light">
              <div className="section-kicker">
                <div className="h-px w-8 bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary font-mono">
                  <TextAnimate
                    animation="blurInUp"
                    by="word"
                    duration={0.8}
                    staggerDelay={0.06}>
                    About
                  </TextAnimate>
                </span>
              </div>
              <h2
                className="section-title"
                style={{ fontFamily: "var(--font-heading)" }}>
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  duration={1.2}
                  staggerDelay={0.08}
                  className="inline">
                  Full-stack craft.
                </TextAnimate>{" "}
                <span className="text-gradient-theme">
                  <TextAnimate
                    animation="blurInUp"
                    by="word"
                    duration={1.2}
                    delay={0.1}
                    staggerDelay={0.08}
                    className="inline">
                    Human emotion.
                  </TextAnimate>
                </span>
              </h2>
              <p className="section-lead mt-4">
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  duration={1.2}
                  delay={0.15}
                  staggerDelay={0.04}>
                  {`${profile.tagline} Design, engineering, and DevOps — one continuous system.`}
                </TextAnimate>
              </p>
            </PremiumDraggable>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <motion.div variants={fadeUp} className="relative">
              <PremiumDraggable>
                <div className="aspect-square rounded-2xl glass-panel p-6 md:p-10 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute top-6 right-6 w-20 h-20 rounded-full border border-primary/20" />
                  <div className="absolute bottom-8 left-8 w-16 h-16 rounded border border-accent/20 rotate-12" />
                  <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-primary/30" />
                  <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-violet-400/30" />

                  <div className="text-center relative z-10">
                    <div className="relative inline-flex items-center justify-center">
                      <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_25%_20%,rgba(168, 85, 247,0.28),rgba(139,92,246,0.12),transparent_62%)] blur-xl scale-110" />
                      <img
                        src="/github-avatar.jpg"
                        alt={`${profile.name} — Full-Stack Web Developer (@bipul-unexpected)`}
                        className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-[1.75rem] object-cover border border-primary/20 shadow-[0_30px_80px_-26px_color-mix(in_srgb,var(--color-primary)_40%,transparent)] ring-1 ring-primary/30"
                        width={320}
                        height={320}
                      />
                    </div>
                    <p className="mt-5 text-sm text-muted-foreground font-mono">
                      {profile.roles.join(" · ")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/70 font-mono">
                      {profile.location} · @{profile.alias}
                    </p>
                  </div>
                </div>
              </PremiumDraggable>
            </motion.div>

            <div className="space-y-6">
              <motion.div variants={fadeUp} className="section-copy">
                <PremiumDraggable intensity="light">
                  <TextAnimate
                    animation="blurInUp"
                    by="word"
                    duration={1.4}
                    staggerDelay={0.04}>
                    I&apos;m Bipul Roy — a Full-Stack Engineer, UI/UX Designer,
                    and DevOps Architect based in Bangladesh. I build seamless
                    digital ecosystems from the first Figma frame to
                    zero-downtime Kubernetes releases.
                  </TextAnimate>
                </PremiumDraggable>
              </motion.div>

              <motion.div variants={fadeUp} className="section-copy">
                <PremiumDraggable intensity="light">
                  <TextAnimate
                    animation="blurInUp"
                    by="word"
                    duration={1.4}
                    delay={0.15}
                    staggerDelay={0.04}>
                    My stack spans React, Next.js, Angular, Node.js, and Django
                    on the product side — and Docker, Kubernetes, GitHub Actions,
                    and Terraform on the delivery side. I care about
                    micro-interactions, clean architecture, and boring
                    deploys.
                  </TextAnimate>
                </PremiumDraggable>
              </motion.div>

              <motion.ul variants={fadeUp} className="space-y-3 pt-1">
                {aboutHighlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </motion.ul>

              <motion.div
                variants={fadeUp}
                className="pt-4 flex flex-wrap items-center gap-3">
                <PremiumDraggable intensity="light" className="w-auto">
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary hover:text-primary hover:scale-[1.02] active:scale-[0.98]">
                    <TextAnimate
                      animation="blurInUp"
                      by="word"
                      duration={0.6}
                      staggerDelay={0.05}>
                      View GitHub
                    </TextAnimate>
                  </a>
                </PremiumDraggable>
                <PremiumDraggable intensity="light" className="w-auto">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary hover:text-primary hover:scale-[1.02] active:scale-[0.98]">
                    <Download className="h-4 w-4" />
                    <TextAnimate
                      animation="blurInUp"
                      by="word"
                      duration={0.6}
                      staggerDelay={0.05}>
                      Download Resume
                    </TextAnimate>
                  </a>
                </PremiumDraggable>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
