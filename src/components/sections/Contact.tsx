import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin, Send } from "lucide-react";
import { GitHubIcon, LinkedInIcon, XIcon } from "../ui/SocialIcons";
import { socialLinks, tallyFormId } from "../../data/portfolio";
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

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const socialProfiles = [
    { icon: GitHubIcon, href: socialLinks.github, label: "GitHub" },
    { icon: LinkedInIcon, href: socialLinks.linkedin, label: "LinkedIn" },
    { icon: XIcon, href: socialLinks.twitter, label: "Twitter" },
  ];

  return (
    <section id="contact" className="relative py-24 md:py-32" ref={ref}>
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
                    Contact
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
                  Let&apos;s work together
                </TextAnimate>
              </h2>
              <p className="section-lead">
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  duration={1.2}
                  delay={0.2}
                  staggerDelay={0.04}>
                  Building something ambitious? I&apos;m open to
                  collaboration — full-stack products, UI/UX systems, and
                  DevOps pipelines that ship.
                </TextAnimate>
              </p>
            </PremiumDraggable>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-14 items-start">
            {/* Left: info */}
            <motion.div variants={fadeUp} className="space-y-6 md:space-y-7">
              <PremiumDraggable>
                <div className="glass-panel rounded-xl p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <a
                      href={`mailto:${socialLinks.email}`}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                      <TextAnimate
                        animation="blurInUp"
                        by="word"
                        duration={0.8}
                        staggerDelay={0.05}>
                        {socialLinks.email}
                      </TextAnimate>
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">
                      <TextAnimate
                        animation="blurInUp"
                        by="word"
                        duration={0.8}
                        delay={0.1}
                        staggerDelay={0.04}>
                        Drop me a line anytime
                      </TextAnimate>
                    </p>
                  </div>
                </div>
              </PremiumDraggable>

              <PremiumDraggable>
                <div className="glass-panel rounded-xl p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      <TextAnimate
                        animation="blurInUp"
                        by="word"
                        duration={0.8}
                        staggerDelay={0.05}>
                        Dhaka, Bangladesh · Worldwide
                      </TextAnimate>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <TextAnimate
                        animation="blurInUp"
                        by="word"
                        duration={0.8}
                        delay={0.1}
                        staggerDelay={0.04}>
                        Remote-first · Full-Stack + DevOps · Open to collab
                      </TextAnimate>
                    </p>
                  </div>
                </div>
              </PremiumDraggable>

              <div className="flex items-center gap-3 pt-4">
                {socialProfiles.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200">
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Right: Tally contact form */}
            <motion.div variants={fadeUp}>
              <PremiumDraggable>
                <div className="glass-panel rounded-xl p-8 md:p-10 text-center space-y-7">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Send className="w-7 h-7 text-primary" />
                  </div>
                  <h3
                    className="text-xl font-bold text-foreground"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    <TextAnimate
                      animation="blurInUp"
                      by="word"
                      duration={0.8}
                      staggerDelay={0.06}>
                      Send me a message
                    </TextAnimate>
                  </h3>
                  <p className="card-copy max-w-sm mx-auto">
                    <TextAnimate
                      animation="blurInUp"
                      by="word"
                      duration={1}
                      delay={0.1}
                      staggerDelay={0.04}>
                      Use the quick Tally form to share your project details.
                      I&apos;ll get back to you within 24 hours.
                    </TextAnimate>
                  </p>
                  <div className="space-y-3 pt-1">
                    <button
                      type="button"
                      data-tally-open={tallyFormId}
                      data-tally-layout="modal"
                      data-tally-width="600"
                      className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
                      <Send className="w-4 h-4" />
                      <TextAnimate
                        animation="blurInUp"
                        by="word"
                        duration={0.6}
                        staggerDelay={0.05}>
                        Open contact form
                      </TextAnimate>
                    </button>
                  </div>
                </div>
              </PremiumDraggable>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
