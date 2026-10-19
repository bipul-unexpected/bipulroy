import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  ExternalLink,
  Monitor,
  Sparkles,
} from "lucide-react";
import { profile, socialLinks } from "../../data/portfolio";
import { GitHubIcon } from "../ui/SocialIcons";
import { scrollToSection } from "../../lib/scrollToSection";

function ActionLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <motion.a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        scrollToSection(href);
      }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className={
        secondary
          ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-background/80 px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
          : "btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold shadow-xl shadow-primary/20"
      }>
      {children}
    </motion.a>
  );
}

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="hero" className="relative isolate overflow-hidden border-b border-border/70 bg-background pt-28 sm:pt-36">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.10),transparent_65%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto grid w-full max-w-6xl gap-14 px-4 pb-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:items-center lg:gap-20">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl">
          <div className="mb-7 flex items-center gap-3 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Available for select work
            </span>
            <span className="hidden text-border sm:inline">/</span>
            <span className="hidden sm:inline">Dhaka · Worldwide</span>
          </div>

          <p className="mb-5 text-sm font-semibold tracking-wide text-primary">
            Full-stack engineering for ambitious teams
          </p>
          <h1 className="max-w-2xl text-[clamp(2.75rem,7vw,5.8rem)] font-bold leading-[0.97] tracking-[-0.06em] text-foreground">
            Build the right thing.
            <span className="block text-muted-foreground">Build it well.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            I design and engineer thoughtful digital products that are clear to
            use, fast in the browser, and dependable in production.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ActionLink href="#projects">
              Explore the work <ArrowRight className="h-4 w-4" />
            </ActionLink>
            <ActionLink href="#contact" secondary>
              Let&apos;s talk
            </ActionLink>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="rounded-full border border-border bg-card/60 px-3 py-1.5">React &amp; TypeScript</span>
            <span className="rounded-full border border-border bg-card/60 px-3 py-1.5">Product UI</span>
            <span className="rounded-full border border-border bg-card/60 px-3 py-1.5">Cloud systems</span>
          </div>
        </motion.div>

        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[30rem]">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-primary/8 blur-3xl" />
          <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-2xl shadow-primary/10">
            <div className="flex items-center justify-between border-b border-border bg-secondary/45 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">bipul.tech / work</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-primary">Selected direction</p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Make complexity feel simple.</h2>
                </div>
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary"><Sparkles className="h-5 w-5" /></div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-background p-4">
                  <Monitor className="h-4 w-4 text-primary" />
                  <p className="mt-5 text-xs font-semibold text-foreground">Interface</p>
                  <p className="mt-1 text-[11px] leading-4 text-muted-foreground">Clear, responsive, considered.</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <Code2 className="h-4 w-4 text-primary" />
                  <p className="mt-5 text-xs font-semibold text-foreground">Engineering</p>
                  <p className="mt-1 text-[11px] leading-4 text-muted-foreground">Solid foundations, no theatre.</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
                <span className="text-xs font-semibold text-foreground">From idea to shipped product</span>
                <ArrowUpRight className="h-4 w-4 text-primary" />
              </div>
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary">
                <GitHubIcon className="h-4 w-4" /> Explore the work in public
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
