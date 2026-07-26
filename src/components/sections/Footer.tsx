/**
 * Footer — same misty landscape as hero + liquid glass panels
 * Visual continuity: hero → CTA → footer share /hero-bg.jpg language
 */
import { useReducedMotion, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { GitHubIcon, LinkedInIcon, XIcon } from "../ui/SocialIcons";
import { socialLinks } from "../../data/portfolio";
import { scrollToSection } from "../../lib/scrollToSection";
import { HeroLandscapeBg } from "../ui/HeroLandscapeBg";

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const socialProfiles = [
  { icon: GitHubIcon, href: socialLinks.github, label: "GitHub" },
  { icon: LinkedInIcon, href: socialLinks.linkedin, label: "LinkedIn" },
  { icon: XIcon, href: socialLinks.twitter, label: "Twitter" },
];

export function Footer() {
  const prefersReduced = useReducedMotion();

  return (
    <footer className="border-t border-border/60 min-h-[50vh] md:min-h-[70vh] flex flex-col justify-center relative z-10 overflow-hidden">
      {/* Shared landscape + animated mist fog */}
      <HeroLandscapeBg intensity="footer" />

      {/* Floating liquid-glass orbs — transparent motion synced with CTA */}
      {!prefersReduced && (
        <>
          <motion.div
            className="pointer-events-none absolute left-[6%] top-[22%] h-36 w-36 rounded-full liquid-glass opacity-45"
            animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute right-[8%] bottom-[20%] h-48 w-48 rounded-full liquid-glass opacity-40"
            animate={{ y: [0, 16, 0], rotate: [0, -5, 0] }}
            transition={{
              duration: 13,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.7,
            }}
          />
          <motion.div
            className="pointer-events-none absolute left-[55%] top-[12%] h-20 w-20 rounded-full liquid-glass opacity-35"
            animate={{ y: [0, -12, 0], x: [0, 10, 0] }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
        </>
      )}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-14 flex-1 flex flex-col justify-between">
        {/* Main liquid-glass panel */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden liquid-glass-strong rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 shadow-lg">
          {/* Inner glass shimmer sweep */}
          {!prefersReduced && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-35"
              style={{
                background:
                  "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
              }}
              animate={{ x: ["-70%", "130%"] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 2.5,
              }}
            />
          )}

          {/* Logo + tagline */}
          <div className="relative max-w-md">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#hero");
              }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight cursor-pointer"
              style={{ fontFamily: "var(--font-heading)" }}>
              Bipul<span className="text-primary">.</span>
            </a>
            <p className="mt-6 text-lg md:text-2xl text-muted-foreground leading-relaxed tracking-[0.01em]">
              Building the future, one commit at a time. Full-stack products,
              premium UI/UX, and DevOps that never flinches.
            </p>
          </div>

          {/* Quick links & socials */}
          <div className="relative flex flex-col items-start md:items-end gap-10">
            <nav className="flex flex-wrap items-center gap-6 md:gap-10">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="text-lg md:text-xl font-medium text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {socialProfiles.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full liquid-glass flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary/40 transition-all duration-300 shadow-sm"
                    aria-label={social.label}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7" />
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Bottom copyright row — soft glass strip */}
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-5 w-full">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed tracking-[0.01em]">
            &copy; {new Date().getFullYear()} Bipul. All rights reserved.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed tracking-[0.01em] flex items-center gap-1.5">
            Built with React, motion, and obsessive attention to detail.
            <Heart className="w-4 h-4 text-primary" />
          </p>
        </div>
      </div>
    </footer>
  );
}
