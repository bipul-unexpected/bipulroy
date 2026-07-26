/**
 * InfiniteMarquee — open-source inspired (Aceternity Infinite Moving Cards pattern)
 * Seamless horizontal tech/skill strip for portfolio trust signals.
 */
import type { CSSProperties } from "react";
import { cn } from "../../lib/utils";

interface InfiniteMarqueeProps {
  items: string[];
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
  className?: string;
  pauseOnHover?: boolean;
}

export function InfiniteMarquee({
  items,
  speed = "normal",
  direction = "left",
  className,
  pauseOnHover = true,
}: InfiniteMarqueeProps) {
  const duration =
    speed === "slow" ? "50s" : speed === "fast" ? "22s" : "35s";

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
      style={
        {
          "--marquee-duration": duration,
          "--marquee-direction": direction === "left" ? "normal" : "reverse",
        } as CSSProperties
      }>
      <div
        className={cn(
          "flex w-max min-w-full shrink-0 gap-3 py-1 animate-marquee",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}>
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center rounded-full border border-border bg-card/80 px-4 py-2 text-[11px] sm:text-xs font-semibold tracking-wide text-foreground/80 shadow-sm backdrop-blur-md whitespace-nowrap">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
