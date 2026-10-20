import type { ReactNode } from "react";

export function ThreeDIconTile({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/90 bg-white/90 shadow-[0_10px_20px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] transition-transform duration-300 [transform:perspective(500px)_rotateX(8deg)_rotateY(-8deg)] group-hover:[transform:perspective(500px)_rotateX(0deg)_rotateY(0deg)_translateY(-2px)] ${className}`}
    >
      <span className="absolute inset-x-2 bottom-1 h-1 rounded-full bg-slate-900/10 blur-[2px]" />
      {children}
    </span>
  );
}
