/**
 * TerminalCard — open-source portfolio pattern (terminal / code identity card)
 * Builds trust for full-stack engineers via familiar developer mental model.
 */
import { motion } from "framer-motion";
import { BorderBeam } from "./BorderBeam";
import { cn } from "../../lib/utils";

const lines = [
  { delay: 0.2, html: '<span class="text-primary">const</span> bipul = {' },
  {
    delay: 0.45,
    html: '&nbsp;&nbsp;role: <span class="text-emerald-500 dark:text-emerald-400">"Full-Stack Engineer"</span>,',
  },
  {
    delay: 0.7,
    html: '&nbsp;&nbsp;stack: [<span class="text-amber-600 dark:text-amber-300">"React"</span>, <span class="text-amber-600 dark:text-amber-300">"Node"</span>, <span class="text-amber-600 dark:text-amber-300">"K8s"</span>],',
  },
  {
    delay: 0.95,
    html: '&nbsp;&nbsp;focus: <span class="text-sky-600 dark:text-sky-300">"Design + Code + Scale"</span>,',
  },
  {
    delay: 1.2,
    html: '&nbsp;&nbsp;status: <span class="text-primary">"open_to_collab"</span>,',
  },
  { delay: 1.45, html: "};" },
  {
    delay: 1.75,
    html: '<span class="text-muted-foreground">// shipping premium web systems</span>',
  },
];

export function TerminalCard({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card/90 shadow-royalty backdrop-blur-xl",
        className,
      )}>
      <BorderBeam size={180} duration={9} />

      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3 bg-secondary/40">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
        <span className="ml-2 text-[11px] font-mono text-muted-foreground truncate">
          bipul-roy · full-stack.ts
        </span>
      </div>

      {/* Code body */}
      <div className="p-5 sm:p-6 font-mono text-[12px] sm:text-[13px] leading-7 text-foreground/90">
        {lines.map((line) => (
          <motion.div
            key={line.delay}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + line.delay, duration: 0.4 }}
            dangerouslySetInnerHTML={{ __html: line.html }}
          />
        ))}
        <motion.span
          className="inline-block w-[8px] h-[1.1em] ml-0.5 align-middle bg-primary"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.85, repeat: Infinity }}
        />
      </div>

      {/* Footer meta */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-[10px] sm:text-[11px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          production-ready
        </span>
        <span>React · Django · DevOps</span>
      </div>
    </motion.div>
  );
}
