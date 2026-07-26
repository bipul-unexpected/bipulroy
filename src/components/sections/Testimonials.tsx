import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "../../data/portfolio";
import { PremiumDraggable } from "../ui/PremiumDraggable";
import { TextAnimate } from "../ui/TextAnimate";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 18 },
  },
};

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="relative py-24 md:py-32" ref={ref}>
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}>
          {/* Header */}
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
                    Testimonials
                  </TextAnimate>
                </span>
              </div>
              <h2
                className="section-title"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  duration={1}
                  staggerDelay={0.08}>
                  What people say
                </TextAnimate>
              </h2>
            </PremiumDraggable>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <PremiumDraggable className="glass-panel rounded-xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="block text-5xl text-primary/15 leading-none select-none"
                      style={{ fontFamily: "Georgia, serif" }}>
                      &ldquo;
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          fill="currentColor"
                          className="w-3.5 h-3.5 text-primary"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="card-copy italic">
                    <TextAnimate
                      animation="blurInUp"
                      by="word"
                      duration={1}
                      delay={0.1}
                      staggerDelay={0.04}>
                      {t.text}
                    </TextAnimate>
                  </p>
                  <div className="mt-7 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        <TextAnimate
                          animation="blurInUp"
                          by="word"
                          duration={0.6}
                          delay={0.15}
                          staggerDelay={0.05}>
                          {t.name}
                        </TextAnimate>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <TextAnimate
                          animation="blurInUp"
                          by="word"
                          duration={0.8}
                          delay={0.2}
                          staggerDelay={0.04}>
                          {`${t.role}, ${t.company}`}
                        </TextAnimate>
                      </p>
                    </div>
                  </div>
                </PremiumDraggable>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
