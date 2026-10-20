import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Code2, Cloud, Server } from "lucide-react";
import { profile, socialLinks } from "../../data/portfolio";
import { GitHubIcon } from "../ui/SocialIcons";
import { scrollToSection } from "../../lib/scrollToSection";

const stack = [
  { label: "Frontend", value: "React · Next.js", icon: Code2 },
  { label: "Backend", value: "Node · Django", icon: Server },
  { label: "Infrastructure", value: "Docker · Cloud", icon: Cloud },
];

function HeroLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  return (
    <motion.a
      href={href}
      onClick={(event) => { event.preventDefault(); scrollToSection(href); }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={secondary
        ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white/65 px-6 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-white"
        : "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] transition hover:bg-slate-800"}>
      {children}
    </motion.a>
  );
}

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="hero" className="relative isolate overflow-hidden bg-[#f8fafc] pb-16 pt-28 text-slate-900 sm:pb-24 sm:pt-36 dark:bg-[#130b25] dark:text-slate-100">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(226,232,240,0.9),transparent_42%),radial-gradient(ellipse_at_bottom_right,rgba(224,231,255,0.7),transparent_42%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(76,29,149,0.24),transparent_42%),radial-gradient(ellipse_at_bottom_right,rgba(30,41,59,0.42),transparent_48%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(rgba(100,116,139,0.22)_1px,transparent_1px)] [background-size:22px_22px] dark:opacity-15" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/50 p-5 shadow-[0_30px_90px_-20px_rgba(15,23,42,0.16)] backdrop-blur-2xl sm:rounded-[2.25rem] sm:p-8 md:p-14 dark:border-white/10 dark:bg-white/[0.06]">
          <div aria-hidden className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-white/80 to-transparent opacity-70 dark:from-white/10" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <motion.div
              initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/65 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                System architecture · active
              </div>
              <p className="mb-4 text-sm font-semibold text-indigo-600 dark:text-violet-300">Full-stack engineer · UI/UX · DevOps</p>
              <h1 className="max-w-3xl text-[clamp(2.65rem,7vw,5.6rem)] font-extrabold leading-[0.98] tracking-[-0.06em] text-slate-950 dark:text-white">
                Engineering fluid
                <span className="block bg-gradient-to-r from-slate-950 via-indigo-900 to-violet-700 bg-clip-text text-transparent dark:from-white dark:via-violet-200 dark:to-violet-400">
                  digital experiences.
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg dark:text-slate-300">
                I design and ship resilient web products with thoughtful interfaces,
                dependable APIs, and infrastructure that stays calm under pressure.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <HeroLink href="#projects">Explore engineering work <ArrowRight className="h-4 w-4" /></HeroLink>
                <HeroLink href="#contact" secondary>Start a conversation</HeroLink>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-500 dark:text-slate-300">
                {["Design-led engineering", "Production-ready delivery", "Remote worldwide"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-indigo-500" />{item}</span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={reducedMotion ? undefined : { opacity: 0, y: 18, rotate: 1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-5 rounded-[2rem] bg-indigo-400/15 blur-3xl dark:bg-violet-500/15" />
              <div className="relative rounded-2xl border border-white/90 bg-white/65 p-4 shadow-[0_18px_45px_-8px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/35">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 dark:border-white/10">
                  <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /><span className="ml-2 font-mono text-[10px] text-slate-500 dark:text-slate-400">Engine.ts</span></div>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-white/10 dark:text-slate-300">99.98%</span>
                </div>
                <div className="space-y-1.5 py-5 font-mono text-[11px] leading-5 text-slate-600 dark:text-slate-300">
                  <p className="text-slate-400">// compiled fluid stack</p>
                  <p><span className="text-indigo-600 dark:text-violet-300">const</span> runtime = <span className="font-semibold text-slate-900 dark:text-white">createPipeline</span>({"{"}</p>
                  <p className="pl-4">architecture: <span className="text-emerald-600 dark:text-emerald-300">&apos;Distributed&apos;</span>,</p>
                  <p className="pl-4">latency: <span className="text-amber-600 dark:text-amber-300">&apos;14ms&apos;</span>,</p>
                  <p className="pl-4">renderMode: <span className="text-indigo-600 dark:text-violet-300">&apos;EdgeHydrated&apos;</span></p>
                  <p>{"});"}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {stack.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-xl border border-white/90 bg-white/60 p-3 dark:border-white/10 dark:bg-white/10">
                      <Icon className="h-4 w-4 text-indigo-500 dark:text-violet-300" />
                      <p className="mt-3 text-[10px] font-semibold text-slate-800 dark:text-white">{label}</p>
                      <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{value}</p>
                    </div>
                  ))}
                </div>
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-violet-300">
                  <GitHubIcon className="h-4 w-4" /> {profile.alias} · open source
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
