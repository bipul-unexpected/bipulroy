import { useEffect, useRef, useState, type ReactNode } from "react";
import { Eye, Minus, Plus } from "lucide-react";

/** Zoom bounds for the footer magnifier lens. */
const ZOOM_MIN = 1.6;
const ZOOM_MAX = 4.6;
const ZOOM_STEP = 1;
/** Default is the level that reads best in the footer: 3.6x. */
const ZOOM_DEFAULT = 3.6;

/** Step a zoom level while keeping it inside the allowed range. */
const stepZoom = (value: number, direction: 1 | -1) =>
  Number(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value + direction * ZOOM_STEP)).toFixed(1));

export function FooterLoupe({ children }: { children: ReactNode }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const shiftRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [zoom, setZoom] = useState(ZOOM_DEFAULT);
  const pointer = useRef({ x: -999, y: -999, targetX: -999, targetY: -999 });

  /**
   * Build the magnified copy of the footer once (and again on resize).
   *
   * The clone is magnified with the CSS `zoom` property rather than
   * `transform: scale()`. A transform-scaled clone is rasterised once at 1x and
   * then GPU-upscaled every frame the pointer moves, which reads as blur.
   * `zoom` is a layout-level scale, so the browser re-lays-out and re-rasterises
   * the copy at the magnified size and the type stays perfectly sharp.
   */
  useEffect(() => {
    const source = sourceRef.current;
    const host = cloneRef.current;
    if (!source || !host) return;

    const copyContent = () => {
      host.replaceChildren();
      const clone = source.cloneNode(true) as HTMLDivElement;
      clone.removeAttribute("ref");
      clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
      clone.querySelectorAll("[class]").forEach((element) => {
        const className = element.getAttribute("class") ?? "";
        element.setAttribute("class", className
          .split(/\s+/)
          .filter((className) => !className.startsWith("backdrop-blur") && !className.includes("blur-"))
          .join(" "));
        if (element instanceof HTMLElement || element instanceof SVGElement) {
          element.style.filter = "none";
        }
      });
      clone.style.width = `${source.offsetWidth}px`;
      clone.style.maxWidth = "none";
      clone.style.pointerEvents = "none";
      host.appendChild(clone);
      // The host is sized in the un-zoomed coordinate space; `zoom` scales it up.
      host.style.width = `${source.offsetWidth}px`;
    };

    copyContent();
    window.addEventListener("resize", copyContent);
    return () => window.removeEventListener("resize", copyContent);
  }, []);

  /**
   * Track the pointer and drive the lens. The magnified copy is positioned with a
   * pure translation, so moving the lens stays a cheap GPU transform on an
   * already-crisp layer.
   */
  useEffect(() => {
    const area = areaRef.current;
    const lens = lensRef.current;
    const shift = shiftRef.current;
    if (!area || !lens || !shift) return;

    let frame = 0;
    const render = () => {
      const state = pointer.current;
      state.x += (state.targetX - state.x) * 0.2;
      state.y += (state.targetY - state.y) * 0.2;
      if (active && state.targetX > 0) {
        lens.style.opacity = "1";
        lens.style.left = `${state.x}px`;
        lens.style.top = `${state.y}px`;
        const bounds = area.getBoundingClientRect();
        // The mirror's content box is inset by its rim, so its centre is the lens centre.
        const radius = (mirrorRef.current?.clientWidth ?? lens.offsetWidth) / 2;
        const relativeX = state.x - bounds.left;
        const relativeY = state.y - bounds.top;
        shift.style.transform = `translate(${radius - relativeX * zoom}px, ${radius - relativeY * zoom}px)`;
      } else {
        lens.style.opacity = "0";
      }
      frame = requestAnimationFrame(render);
    };

    const move = (event: PointerEvent) => {
      const bounds = area.getBoundingClientRect();
      if (event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom) {
        pointer.current.targetX = event.clientX;
        pointer.current.targetY = event.clientY;
      } else {
        pointer.current.targetX = -999;
        pointer.current.targetY = -999;
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
    };
  }, [active, zoom]);

  return (
    <div ref={areaRef} className="relative">
      <div ref={sourceRef}>{children}</div>

      {/* ── Magnifier lens ── */}
      <div
        ref={lensRef}
        aria-hidden
        className="pointer-events-none fixed z-[55] h-44 w-44 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full opacity-0 transition-opacity duration-200 sm:h-56 sm:w-56"
      >
        {/* Magnified copy of the footer */}
        <div
          ref={mirrorRef}
          className="absolute inset-0 overflow-hidden rounded-full border-[6px] border-white/[0.85] bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.16),0_30px_60px_-18px_rgba(15,23,42,0.45),inset_0_0_20px_rgba(255,255,255,0.85)] dark:border-slate-600/90 dark:bg-slate-950"
        >
          <div ref={shiftRef} className="absolute left-0 top-0 will-change-transform">
            <div ref={cloneRef} className="bg-background" style={{ zoom }} />
          </div>
        </div>

        {/* Glass sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(115%_85%_at_28%_10%,rgba(255,255,255,0.38),transparent_45%)]" />
        {/* Inner rim */}
        <div className="pointer-events-none absolute inset-[5px] rounded-full border border-white/[0.45] shadow-[inset_0_0_16px_rgba(99,102,241,0.18)]" />
        {/* Reticle */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
          <span className="h-px w-full bg-white/90" />
          <span className="absolute h-full w-px bg-white/90" />
          <span className="absolute h-7 w-7 rounded-full border border-white/80" />
        </div>
        {/* Zoom badge */}
        <span className="absolute left-1/2 top-2.5 -translate-x-1/2 rounded-full bg-slate-950/80 px-2 py-0.5 font-mono text-[8px] tracking-wider text-white/90 ring-1 ring-white/[0.15] backdrop-blur-sm">
          ZOOM {zoom.toFixed(1)}x
        </span>
      </div>

      {/* ── Controls ── */}
      <div className="pointer-events-auto absolute right-4 top-4 z-20 flex items-center gap-1 rounded-xl border border-border bg-card/80 p-1 shadow-sm backdrop-blur-md">
        <button type="button" onClick={() => setZoom((value) => stepZoom(value, 1))} disabled={zoom >= ZOOM_MAX} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40" aria-label="Increase footer magnifier zoom"><Plus className="h-3.5 w-3.5" /></button>
        <button type="button" onClick={() => setZoom((value) => stepZoom(value, -1))} disabled={zoom <= ZOOM_MIN} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40" aria-label="Decrease footer magnifier zoom"><Minus className="h-3.5 w-3.5" /></button>
        <button type="button" onClick={() => setActive((value) => !value)} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold ${active ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-secondary text-muted-foreground"}`}><Eye className="h-3 w-3" />{active ? "Loupe" : "Off"}</button>
      </div>
    </div>
  );
}
