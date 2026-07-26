import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { experiences } from "../../data/portfolio";
import { PremiumDraggable } from "../ui/PremiumDraggable";
import { TextAnimate } from "../ui/TextAnimate";

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 18 },
  },
};

export function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="relative py-24 md:py-32" ref={ref}>
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}>
          {/* Header */}
          <motion.div variants={fadeLeft} className="mb-14 md:mb-16">
            <PremiumDraggable intensity="light">
              <div className="section-kicker">
                <div className="h-px w-8 bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary font-mono">
                  <TextAnimate
                    animation="blurInUp"
                    by="word"
                    duration={0.8}
                    staggerDelay={0.06}>
                    Journey
                  </TextAnimate>
                </span>
              </div>
              <h2
                className="section-title"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  duration={1.2}
                  staggerDelay={0.08}>
                  Path of a full-stack builder
                </TextAnimate>
              </h2>
            </PremiumDraggable>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />

            <div className="space-y-11">
              {experiences.map((exp) => (
                <motion.div
                  key={exp.year}
                  variants={fadeLeft}
                  className="relative pl-10">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2 border-primary bg-background z-10" />
                  <div className="absolute left-[3px] top-[7px] w-[9px] h-[9px] rounded-full bg-primary" />

                  {/* Content card */}
                  <PremiumDraggable className="w-full">
                    <div className="glass-panel rounded-xl p-6 md:p-7">
                      <span className="inline-block text-xs font-mono text-primary bg-primary/10 rounded-full px-3 py-1 mb-3">
                        <TextAnimate
                          animation="blurInUp"
                          by="word"
                          duration={0.6}
                          staggerDelay={0.05}>
                          {exp.year}
                        </TextAnimate>
                      </span>
                      <h3
                        className="card-title"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        <TextAnimate
                          animation="blurInUp"
                          by="word"
                          duration={0.8}
                          staggerDelay={0.06}>
                          {exp.title}
                        </TextAnimate>
                      </h3>
                      <p className="card-copy mt-1.5">
                        <TextAnimate
                          animation="blurInUp"
                          by="word"
                          duration={0.8}
                          delay={0.1}
                          staggerDelay={0.04}>
                          {exp.company}
                        </TextAnimate>
                      </p>
                      <p className="card-copy mt-4">
                        <TextAnimate
                          animation="blurInUp"
                          by="word"
                          duration={1}
                          delay={0.15}
                          staggerDelay={0.04}>
                          {exp.description}
                        </TextAnimate>
                      </p>

                      {/* Highlights */}
                      <div className="mt-5 space-y-2.5">
                        {exp.highlights.map((h, idx) => (
                          <div key={h} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="card-copy">
                              <TextAnimate
                                animation="blurInUp"
                                by="word"
                                duration={0.8}
                                delay={0.2 + idx * 0.05}
                                staggerDelay={0.04}>
                                {h}
                              </TextAnimate>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PremiumDraggable>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
