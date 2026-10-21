import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CornerDownLeft, X } from "lucide-react";
import { profile, services, socialLinks, stats, techStack } from "../../data/portfolio";
import { scrollToSection } from "../../lib/scrollToSection";

interface TerminalModeProps {
  open: boolean;
  onExit: () => void;
  onToggleTheme: () => void;
}

interface TerminalLine {
  type: "command" | "output" | "error" | "system";
  text: string;
}

const fileTree = [
  "about/",
  "projects/",
  "journal/",
  "services/",
  "experience/",
  "contact/",
  "README.md",
  "package.json",
];

const helpText = [
  "whoami       show the developer profile",
  "ls           list public portfolio paths",
  "pwd          print the current virtual path",
  "cat README   read the portfolio introduction",
  "open <path>  jump to a portfolio section",
  "theme        toggle the visual theme",
  "clear        clear the terminal",
  "help         show available commands",
  "exit         return to the portfolio",
  "",
  "This is a safe browser terminal. It does not execute operating-system commands.",
];

function initialLines(): TerminalLine[] {
  return [
    { type: "system", text: "BIPUL OS 1.0 · portfolio shell ready" },
    { type: "system", text: 'Type "help" for commands. Type "exit" to return.' },
    { type: "output", text: "" },
  ];
}

export function TerminalMode({ open, onExit, onToggleTheme }: TerminalModeProps) {
  const [lines, setLines] = useState<TerminalLine[]>(initialLines);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 0);
    }
  }, [open, lines]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onExit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onExit]);

  function writeCommand(command: string) {
    const normalized = command.trim().toLowerCase();
    const args = normalized.split(/\s+/).slice(1);
    const output: TerminalLine[] = [];

    switch (normalized) {
      case "":
        break;
      case "help":
        helpText.forEach((text) => output.push({ type: "output", text }));
        break;
      case "whoami":
        output.push(
          { type: "output", text: `${profile.name} · ${profile.alias}` },
          { type: "output", text: `${profile.roles.join(" · ")} · ${profile.location}` },
          { type: "output", text: profile.philosophy },
        );
        break;
      case "ls":
      case "ls -la":
        fileTree.forEach((file) => output.push({ type: "output", text: file }));
        break;
      case "pwd":
        output.push({ type: "output", text: "/home/bipul/portfolio" });
        break;
      case "date":
        output.push({ type: "output", text: new Date().toString() });
        break;
      case "echo":
        output.push({ type: "output", text: "" });
        break;
      case "cat readme":
      case "cat readme.md":
        output.push(
          { type: "output", text: "Bipul builds full-stack products people trust." },
          { type: "output", text: "Pixel-perfect UI · solid APIs · calm deployments." },
          { type: "output", text: `Contact: ${socialLinks.email}` },
        );
        break;
      case "theme":
        onToggleTheme();
        output.push({ type: "output", text: "Theme transition initiated." });
        break;
      case "clear":
        setLines([]);
        setInput("");
        return;
      case "exit":
        onExit();
        return;
      default:
        if (normalized === "cd .." || normalized === "cd /home/bipul/portfolio") {
          output.push({ type: "output", text: "/home/bipul/portfolio" });
        } else if (normalized.startsWith("open ")) {
          const target = args[0];
          const section = target === "about" ? "#about"
            : target === "projects" ? "#projects"
              : target === "journal" ? "#journal"
                : target === "services" ? "#services"
                  : target === "experience" ? "#experience"
                    : target === "contact" ? "#contact" : null;
          if (section) {
            onExit();
            window.setTimeout(() => scrollToSection(section), 220);
            output.push({ type: "output", text: `Opening ${target}...` });
          } else {
            output.push({ type: "error", text: `open: ${target || "path"}: path not found` });
          }
        } else if (normalized === "neofetch") {
          output.push(
            { type: "output", text: "   ██████  bipul@portfolio" },
            { type: "output", text: `   OS      Bipul OS 1.0` },
            { type: "output", text: `   Stack   ${Object.values(techStack).flat().slice(0, 6).join(" · ")}` },
            { type: "output", text: `   Work    ${services.length} services · ${stats[0].value}${stats[0].suffix} projects delivered` },
          );
        } else {
          output.push({ type: "error", text: `${command}: command not found. Type "help".` });
        }
    }

    setLines((current) => [
      ...current,
      ...(normalized ? [{ type: "command" as const, text: command }] : []),
      ...output,
    ]);
    setInput("");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
          animate={{ opacity: 1, clipPath: "circle(150% at 95% 5%)" }}
          exit={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Bipul portfolio terminal"
          className="fixed inset-0 z-[70] overflow-hidden bg-[#050507] p-3 text-[#e8e8ed] sm:p-8"
          onClick={() => inputRef.current?.focus()}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(124,58,237,0.2),transparent_35%),radial-gradient(circle_at_15%_85%,rgba(14,165,233,0.1),transparent_30%)]" />
          <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/[0.15] bg-[#101014]/95 shadow-[0_32px_100px_rgba(0,0,0,0.55)] ring-1 ring-white/5 sm:rounded-3xl">
            <div className="flex items-center border-b border-white/10 bg-[#18181d] px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2"><button type="button" onClick={onExit} className="h-3 w-3 rounded-full bg-[#ff5f57] transition hover:brightness-125" aria-label="Close terminal" /><button type="button" onClick={onExit} className="h-3 w-3 rounded-full bg-[#febc2e] transition hover:brightness-125" aria-label="Minimize terminal" /><span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden /></div>
              <div className="mx-auto flex items-center gap-2 font-mono text-[11px] text-white/[0.55] sm:text-xs"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />bipul@portfolio — zsh</div>
              <button type="button" onClick={onExit} className="rounded-lg p-1.5 text-white/[0.45] transition hover:bg-white/10 hover:text-white" aria-label="Exit terminal mode"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 bg-[#131318] px-4 py-2 font-mono text-[10px] text-white/[0.35] sm:px-5"><span>~/portfolio</span><span>browser sandbox · {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>
            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 font-mono text-[12px] leading-6 sm:px-8 sm:text-sm">
              {lines.map((line, index) => (
                <div key={`${index}-${line.text}`} className={line.type === "command" ? "text-white" : line.type === "error" ? "text-rose-400" : line.type === "system" ? "text-violet-300" : "text-white/[0.65]"}>
                  {line.type === "command" && <span className="mr-2 text-emerald-400">❯</span>}{line.text || "\u00a0"}
                </div>
              ))}
              <form onSubmit={(event) => { event.preventDefault(); writeCommand(input); }} className="mt-1 flex items-center gap-2">
                <span className="text-emerald-400">❯</span>
                <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 bg-transparent text-white outline-none" aria-label="Terminal command" autoComplete="off" spellCheck={false} />
              </form>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#0c0c0f] px-4 py-3 font-mono text-[10px] text-white/40 sm:px-5">
              <span className="inline-flex items-center gap-2"><CornerDownLeft className="h-3 w-3" />Enter to run · Esc to exit</span>
              <span className="inline-flex items-center gap-1">browser shell <ArrowUpRight className="h-3 w-3" /></span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
