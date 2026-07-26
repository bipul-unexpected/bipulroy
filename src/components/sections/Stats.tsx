import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "../../data/portfolio";
import { PremiumDraggable } from "../ui/PremiumDraggable";
import { TextAnimate } from "../ui/TextAnimate";

function AnimatedCounter({
  value,
  suffix,
}: {
  value: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const target = parseInt(value, 10);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix && <span className="text-primary">{suffix}</span>}
    </span>
  );
}

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="stats"
      className="relative py-20 md:py-28 border-t border-b border-border/50"
      ref={ref}>
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}>
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring" as const,
                    stiffness: 80,
                    damping: 18,
                  },
                },
              }}>
              <PremiumDraggable>
                <div
                  className="text-4xl md:text-5xl font-bold text-foreground leading-none tracking-[0.01em]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed tracking-[0.01em]">
                  <TextAnimate
                    animation="blurInUp"
                    by="word"
                    duration={0.8}
                    staggerDelay={0.05}>
                    {stat.label}
                  </TextAnimate>
                </p>
              </PremiumDraggable>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-14 text-center text-sm text-muted-foreground leading-relaxed tracking-[0.01em]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}>
          <PremiumDraggable intensity="feather">
            <TextAnimate
              animation="blurInUp"
              by="word"
              duration={1.2}
              staggerDelay={0.06}>
              Full-Stack Engineer · UI/UX Designer · DevOps Architect
            </TextAnimate>
          </PremiumDraggable>
        </motion.div>
      </div>
    </section>
  );
}
