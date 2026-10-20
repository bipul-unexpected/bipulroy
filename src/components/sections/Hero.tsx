import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Code2, Cpu, Gauge, Mail, Zap } from "lucide-react";
import { scrollToSection } from "../../lib/scrollToSection";

const technologies = ["Next.js 15", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "GraphQL"];

function SectionLink({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <a
      href={href}
      onClick={(event) => { event.preventDefault(); scrollToSection(href); }}
      className={`group inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl px-6 text-sm font-medium transition-all duration-200 active:scale-[0.98] sm:w-auto sm:rounded-2xl ${
        primary
          ? "bg-slate-900 text-white shadow-[0_6px_20px_rgba(15,23,42,0.2)] hover:scale-[1.02] hover:bg-slate-800 hover:shadow-[0_10px_28px_rgba(15,23,42,0.28)]"
          : "border border-white/80 bg-white/45 text-slate-800 shadow-[0_6px_18px_rgba(15,23,42,0.07)] backdrop-blur-md hover:scale-[1.02] hover:bg-white/70"
      }`}
    >
      {children}
    </a>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <aside className={`rounded-2xl border border-white/80 bg-white/65 p-4 shadow-[0_18px_45px_-8px_rgba(15,23,42,0.1)] backdrop-blur-2xl transition duration-500 hover:scale-[1.02] hover:bg-white/80 ${className}`}>
      {children}
    </aside>
  );
}

export function Hero() {
  const reducedMotion = useReducedMotion();
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#fbfbfd] px-3 py-24 font-sans text-slate-900 sm:px-6 sm:py-32 lg:px-8">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#f9f9fb]">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f8f9fa] to-[#f1f3f5] opacity-95" />
        <motion.div className="absolute -left-[10%] -top-[18%] h-[68vw] w-[68vw] rounded-full bg-gradient-to-tr from-slate-200/70 via-slate-100/80 to-transparent blur-[110px]" animate={reducedMotion ? undefined : { x: [0, 35, -30, 0], y: [0, -50, 30, 0], scale: [1, 1.09, 0.95, 1], rotate: [0, 4, -3, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute -right-[12%] top-[20%] h-[62vw] w-[62vw] rounded-full bg-gradient-to-bl from-amber-50/80 via-[#ecefea]/60 to-transparent blur-[125px]" animate={reducedMotion ? undefined : { x: [0, -40, 30, 0], y: [0, 35, -40, 0], scale: [1, 1.08, 0.94, 1], rotate: [0, -5, 4, 0] }} transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }} />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.035)_1px,transparent_0)] [background-size:24px_24px] opacity-30" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center">
        <div className="mb-5 flex items-center gap-2 rounded-full border border-white/90 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700 shadow-lg shadow-slate-900/[0.04] backdrop-blur-2xl sm:mb-8 sm:gap-2.5 sm:px-3.5">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" /></span>
          <span><span className="hidden sm:inline">Optical </span>Loupe-inspired interface</span>
          <span className="hidden text-slate-300 sm:inline">|</span>
          <span className="hidden rounded-md border border-white/70 bg-white/60 px-2 py-0.5 font-mono text-[10px] font-medium sm:inline">SF &amp; Remote</span>
        </div>

        <main id="heroInspectionArea" className="relative w-full">
          <GlassCard className="float-card-1 mb-4 w-full sm:max-w-md lg:absolute lg:-left-10 lg:-top-10 lg:z-20 lg:mb-0 lg:w-80">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3">
              <div className="flex items-center gap-2"><div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div><span className="font-mono text-[11px] text-slate-500">Engine.ts</span></div>
              <span className="rounded-full border border-white/90 bg-white/70 px-2 py-0.5 font-mono text-[10px] text-slate-600"><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />99.98%</span>
            </div>
            <div className="mt-3 space-y-1 font-mono text-[11px] leading-relaxed text-slate-700">
              <div className="text-slate-400">// Compiled fluid stack</div><div><span className="font-semibold text-indigo-600">const</span> runtime = <strong>createPipeline</strong>({"{"}</div>
              <div className="pl-3.5 text-slate-600">architecture: <span className="text-emerald-600">&apos;Distributed&apos;</span>,</div><div className="pl-3.5 text-slate-600">latency: <span className="text-amber-600">&apos;14ms&apos;</span>,</div><div className="pl-3.5 text-slate-600">renderMode: <span className="text-indigo-600">&apos;EdgeHydrated&apos;</span></div><div>{"});"}</div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-200/40 pt-2.5 text-[11px] text-slate-500"><span className="flex items-center gap-1.5 font-medium text-slate-700"><Code2 className="h-3.5 w-3.5 text-indigo-500" />TypeScript 5.4</span><span className="font-mono text-[10px] text-slate-400">Zero overhead</span></div>
          </GlassCard>

          <GlassCard className="float-card-2 mb-4 w-full sm:max-w-md lg:absolute lg:-right-8 lg:-top-12 lg:z-20 lg:mb-0 lg:w-72">
            <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white bg-white/90 shadow-sm"><Cpu className="h-6 w-6 animate-[spin_12s_linear_infinite] text-cyan-600" /></div><div><div className="flex items-center gap-1.5 text-[13px] font-semibold leading-tight text-slate-900">React &amp; Next.js <span className="h-2 w-2 rounded-full bg-emerald-500" /></div><p className="text-[11px] text-slate-500">Fluid Reactive Systems</p></div></div>
            <div className="mt-3.5 grid grid-cols-3 gap-1.5 font-mono text-center text-[11px]"><div className="rounded-lg border border-white/90 bg-white/70 px-2 py-1"><span className="block text-[9px] uppercase tracking-wider text-slate-400">Node</span><b>Async</b></div><div className="rounded-lg border border-white/90 bg-white/70 px-2 py-1"><span className="block text-[9px] uppercase tracking-wider text-slate-400">GraphQL</span><b>Typed</b></div><div className="rounded-lg border border-white/90 bg-white/70 px-2 py-1"><span className="block text-[9px] uppercase tracking-wider text-slate-400">Cloud</span><b>Edge</b></div></div>
          </GlassCard>

          <motion.div id="targetHeroSurface" initial={reducedMotion ? undefined : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="relative overflow-hidden rounded-2xl border border-white/90 bg-white/50 px-4 py-10 text-center shadow-[0_30px_90px_-15px_rgba(15,23,42,0.1)] backdrop-blur-2xl sm:rounded-3xl sm:px-8 sm:py-16 md:rounded-[38px] md:px-14 md:py-20">
            <div aria-hidden className="glass-specular pointer-events-none absolute inset-x-0 top-0 h-40 opacity-80" /><div aria-hidden className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.08)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]" />
            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
              <h1 className="mb-5 text-3xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:mb-6 sm:text-5xl md:text-6xl lg:text-[68px] lg:leading-[1.06]">Engineering Fluid <br className="hidden sm:inline" /><span className="bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-950 bg-clip-text text-transparent">Digital Experiences.</span></h1>
              <p className="mb-8 max-w-2xl px-2 text-sm leading-relaxed text-slate-500 sm:mb-10 sm:text-base md:text-lg lg:text-xl">Full-Stack Systems Architect crafting weightless interfaces and resilient backend engines. Specializing in <b className="rounded border border-slate-200/40 bg-slate-100/60 px-1 py-0.5 text-slate-900">React</b>, <b className="rounded border border-slate-200/40 bg-slate-100/60 px-1 py-0.5 text-slate-900">TypeScript</b>, and high-throughput <b className="rounded border border-slate-200/40 bg-slate-100/60 px-1 py-0.5 text-slate-900">Node.js</b> cloud infrastructures.</p>
              <div className="flex w-full flex-col justify-center gap-3 px-2 sm:w-auto sm:flex-row sm:gap-4"><SectionLink href="#projects" primary>Explore Engineering Work <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1" /></SectionLink><SectionLink href="#contact"><Mail className="h-4 w-4 text-slate-600" />Initiate Dialogue</SectionLink></div>
              <div className="mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-slate-200/60 pt-6 font-mono text-[11px] text-slate-400 sm:mt-12 sm:gap-x-6 sm:pt-8"><span className="rounded border border-slate-200/50 bg-slate-100/70 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-700">Verified Core</span>{technologies.map((technology, index) => <span key={technology} className={index % 2 ? "hidden sm:inline" : ""}>{index > 0 && <span className="mr-4 text-slate-300">•</span>}{technology}</span>)}</div>
            </div>
          </motion.div>

          <GlassCard className="float-card-3 mt-4 w-full sm:max-w-md lg:absolute lg:-bottom-8 lg:right-6 lg:z-20 lg:mt-0 lg:w-72">
            <div className="mb-2 flex items-center justify-between"><div className="flex items-center gap-2"><div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-200/60 bg-emerald-50 text-emerald-600"><Zap className="h-4 w-4" /></div><span className="text-xs font-semibold text-slate-800">Lighthouse 100</span></div><span className="rounded-full border border-emerald-200/50 bg-emerald-100/80 px-2 py-0.5 font-mono text-[10px] text-emerald-700">Optimal</span></div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/60 p-0.5"><div className="h-full w-[99%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" /></div><div className="mt-2.5 flex items-center justify-between font-mono text-[11px] text-slate-500"><span className="font-sans">60fps Interactions</span><b className="text-slate-800">0.02s INP</b></div>
          </GlassCard>
        </main>
      </div>
    </section>
  );
}
