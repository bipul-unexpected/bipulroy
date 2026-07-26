import { useState, useEffect, useCallback } from "react";

const SECTION_IDS = [
  "hero",
  "stats",
  "about",
  "projects",
  "case-studies",
  "services",
  "tech-stack",
  "experience",
  "testimonials",
  "contact",
] as const;

/**
 * Scroll spy based on which section's top is closest below the nav line.
 * More reliable than multiple IntersectionObservers fighting each other.
 */
export function useScrollProgress() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);

  const update = useCallback(() => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 40);

    const navLine = scrollY + 120; // roughly under sticky nav
    let current: string = "hero";

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;

      // Layout offset (transform-safe)
      let top = 0;
      let node: HTMLElement | null = el;
      while (node) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }

      if (top <= navLine) {
        current = id;
      }
    }

    setActiveSection((prev) => (prev === current ? prev : current));
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // Initial + after layout settles
    update();
    const t = window.setTimeout(update, 200);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(t);
    };
  }, [update]);

  return { activeSection, isScrolled };
}
