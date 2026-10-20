import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reducedMotion || !finePointer) return;

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
      lerp: 0.1,
    });
    let frame = 0;

    const animate = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(animate);
    };
    const handleScrollRequest = (event: Event) => {
      const customEvent = event as CustomEvent<{ top: number; behavior: ScrollBehavior }>;
      if (customEvent.detail.behavior === "auto") return;
      customEvent.preventDefault();
      lenis.scrollTo(customEvent.detail.top, {
        duration: 0.65,
        lock: false,
        force: true,
      });
    };

    window.addEventListener("portfolio:smooth-scroll", handleScrollRequest);
    frame = window.requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("portfolio:smooth-scroll", handleScrollRequest);
      window.cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
