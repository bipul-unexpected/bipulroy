import { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "./components/layout/Navbar";
import { CustomCursor } from "./components/ui/CustomCursor";
import { SectionCinematicReveal } from "./components/ui/SectionCinematicReveal";
import { ThemeTransition, type ThemeRipple } from "./components/ui/ThemeTransition";
import { useMediaQuery } from "react-responsive";

import { Hero } from "./components/sections/Hero";
import { Stats } from "./components/sections/Stats";
import { About } from "./components/sections/About";
import { Projects } from "./components/sections/Projects";
import { CaseStudies } from "./components/sections/CaseStudies";
import { Services } from "./components/sections/Services";
import { TechStack } from "./components/sections/TechStack";
import { Experience } from "./components/sections/Experience";
import { Testimonials } from "./components/sections/Testimonials";
import { Contact } from "./components/sections/Contact";
import { AuroraHero } from "./components/sections/AuroraHero";
import { Footer } from "./components/sections/Footer";
import { useScrollProgress } from "./hooks/useScrollProgress";

const THEME_KEY = "bipul-theme";

function applyTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.add("theme-midnight");
  root.classList.remove("light", "dark");
  root.classList.add(dark ? "dark" : "light");
  root.setAttribute("data-theme", dark ? "dark" : "light");
  localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", dark ? "#1A0B2E" : "#FAF5FF");
  }
}

function readStoredDark(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(THEME_KEY) !== "light";
}

function App() {
  const { activeSection, isScrolled } = useScrollProgress();
  const [isDark, setIsDark] = useState(readStoredDark);
  const [ripple, setRipple] = useState<ThemeRipple | null>(null);
  const pendingTheme = useRef<boolean | null>(null);
  const midFired = useRef(false);

  useEffect(() => {
    applyTheme(isDark);
    const root = document.documentElement;
    const desired = isDark ? "dark" : "light";
    const lock = () => {
      if (
        !root.classList.contains(desired) ||
        root.classList.contains(isDark ? "light" : "dark")
      ) {
        root.classList.remove("light", "dark");
        root.classList.add("theme-midnight", desired);
        root.setAttribute("data-theme", desired);
      }
    };
    lock();
    const observer = new MutationObserver(lock);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    const t = window.setTimeout(lock, 100);
    return () => {
      observer.disconnect();
      window.clearTimeout(t);
    };
  }, [isDark]);

  const toggleTheme = useCallback(
    (e?: React.MouseEvent | MouseEvent) => {
      const next = !isDark;
      pendingTheme.current = next;
      midFired.current = false;

      const x =
        e && "clientX" in e
          ? e.clientX
          : typeof window !== "undefined"
            ? window.innerWidth - 80
            : 0;
      const y =
        e && "clientY" in e
          ? e.clientY
          : typeof window !== "undefined"
            ? 48
            : 0;

      setRipple({
        x,
        y,
        toDark: next,
        id: Date.now(),
      });

      // Fallback if onUpdate midpoint doesn't fire
      window.setTimeout(() => {
        if (!midFired.current && pendingTheme.current !== null) {
          midFired.current = true;
          setIsDark(pendingTheme.current);
          applyTheme(pendingTheme.current);
        }
      }, 320);
    },
    [isDark],
  );

  const handleRippleMid = useCallback(() => {
    if (midFired.current || pendingTheme.current === null) return;
    midFired.current = true;
    setIsDark(pendingTheme.current);
    applyTheme(pendingTheme.current);
  }, []);

  const handleRippleDone = useCallback(() => {
    if (pendingTheme.current !== null && !midFired.current) {
      setIsDark(pendingTheme.current);
      applyTheme(pendingTheme.current);
    }
    pendingTheme.current = null;
    setRipple(null);
  }, []);

  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden transition-colors duration-300">
      {isDesktop && <CustomCursor />}

      <ThemeTransition
        ripple={ripple}
        onMidpoint={handleRippleMid}
        onComplete={handleRippleDone}
      />

      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: isDark
            ? "radial-gradient(120% 70% at 50% 0%, rgba(168,85,247,0.12) 0%, rgba(168,85,247,0.04) 28%, rgba(26,11,46,0) 72%)"
            : "radial-gradient(120% 70% at 50% 0%, rgba(124,58,237,0.1) 0%, rgba(124,58,237,0.04) 32%, rgba(250,245,255,0) 72%)",
        }}
      />
      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: isDark
            ? "linear-gradient(180deg, rgba(26,11,46,0.35) 0%, rgba(26,11,46,0) 30%, rgba(16,6,30,0.55) 100%)"
            : "linear-gradient(180deg, rgba(250,245,255,0.2) 0%, rgba(250,245,255,0) 35%, rgba(228,220,240,0.45) 100%)",
        }}
      />
      <Navbar
        activeSection={activeSection}
        isScrolled={isScrolled}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
      <main className="relative z-10">
        <Hero />
        <SectionCinematicReveal tone="lift">
          <Stats />
        </SectionCinematicReveal>
        <SectionCinematicReveal tone="glide-left">
          <About />
        </SectionCinematicReveal>
        <SectionCinematicReveal tone="curtain">
          <Projects />
        </SectionCinematicReveal>
        <SectionCinematicReveal tone="glide-right">
          <CaseStudies />
        </SectionCinematicReveal>
        <SectionCinematicReveal tone="depth">
          <Services />
        </SectionCinematicReveal>
        <SectionCinematicReveal tone="float">
          <TechStack />
        </SectionCinematicReveal>
        <SectionCinematicReveal tone="vault">
          <Experience />
        </SectionCinematicReveal>
        <SectionCinematicReveal tone="glide-right">
          <Testimonials />
        </SectionCinematicReveal>
        <SectionCinematicReveal tone="depth">
          <Contact />
        </SectionCinematicReveal>
        <AuroraHero />
      </main>
      <SectionCinematicReveal tone="vault" className="relative z-10">
        <Footer />
      </SectionCinematicReveal>
    </div>
  );
}

export default App;
