import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { scrollToSection } from '../../lib/scrollToSection'

const navLinks = [
  { label: 'About', href: '#about', section: 'about' },
  { label: 'Projects', href: '#projects', section: 'projects' },
  { label: 'Services', href: '#services', section: 'services' },
  { label: 'Experience', href: '#experience', section: 'experience' },
  { label: 'Contact', href: '#contact', section: 'contact' },
]

interface NavbarProps {
  activeSection: string
  isScrolled: boolean
  isDark?: boolean
  onToggleTheme?: (e?: React.MouseEvent) => void
}

export function Navbar({ activeSection, isScrolled, isDark = true, onToggleTheme }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isNavHovered, setIsNavHovered] = useState(false)
  const { scrollYProgress } = useScroll()

  // Scroll immediately on click — no setTimeout (first click was dropped by delay + reflow)
  const premiumScrollTo = useCallback(
    (e: React.MouseEvent<HTMLElement>, href: string) => {
      e.preventDefault()
      setMobileOpen(false)
      scrollToSection(href)
    },
    [],
  )

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[60] origin-left pointer-events-none"
        style={{ scaleX: scrollYProgress }}
      />

      {/* pointer-events-auto on the fixed shell so the first click always hits links */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div
          className={`pointer-events-auto w-full flex justify-center transition-[padding] duration-300 ${
            isScrolled ? 'pt-3 md:pt-4' : 'pt-3 md:pt-6'
          }`}>
          <nav
            onMouseEnter={() => setIsNavHovered(true)}
            onMouseLeave={() => setIsNavHovered(false)}
            className={`relative flex items-center justify-between gap-2 w-[calc(100vw-2rem)] max-w-5xl px-3 md:px-5 py-2 md:py-2.5 rounded-2xl md:rounded-full border transition-[background,box-shadow,border-color] duration-300 ${
              isScrolled || isNavHovered
                ? 'bg-card/95 backdrop-blur-xl border-border shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)]'
                : 'bg-card/70 backdrop-blur-md border-border/70'
            }`}
          >
          <div className={`absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none transition-opacity duration-500 ${isNavHovered ? 'opacity-100' : 'opacity-0'}`} />

          {/* Left: Logo & Status */}
          <div className="flex items-center gap-2 md:gap-3 relative z-10 shrink-0">
            <a href="#hero" className="flex items-center gap-2 group cursor-pointer focus:outline-none" onClick={(e) => premiumScrollTo(e, '#hero')}>
               
              <div className="flex flex-col justify-center">
                
                {/* Typography Logo Engine - Expanding Apple-style Hover Reveal */}
                <div className="flex items-center text-xl md:text-[28px] font-bold tracking-tight text-foreground/90 group-hover:text-foreground transition-all duration-700" style={{ fontFamily: "var(--font-heading)" }}>
                  
                  {/* Large Floating Hero "B" */}
                  <div className="relative flex items-center justify-center flex-shrink-0 h-8 md:h-11 lg:h-[48px] z-20">
                    <img
                      src="/b.png"
                      alt="Bipul"
                      className="h-full w-auto object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Glowing footprint physics */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-8 bg-primary/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  </div>
                  
                  {/* Dynamic Name Reveal - 'ipul.' hidden by default */}
                  <div 
                    className="overflow-hidden flex items-baseline max-w-0 opacity-0 -ml-4 group-hover:ml-0.5 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" 
                  >
                    <span className="tracking-tighter">ipul</span>
                    <span className="text-primary drop-shadow-[0_0_8px_rgba(168, 85, 247,0.65)]">.</span>
                  </div>

                </div>
                
                {!isScrolled && (
                  <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap mt-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
                    <span className="text-[11px] text-muted-foreground font-medium">Full-Stack · Open to collab</span>
                  </div>
                )}

              </div>
            </a>
          </div>

          {/* Center: Links — always available on desktop (no hide-on-scroll) */}
          <div 
            className="hidden lg:flex items-center justify-center gap-0.5 bg-secondary/50 border border-border rounded-full py-1 px-1 shadow-sm backdrop-blur-xl min-w-max shrink-0 mx-2"
          >
            {navLinks.map((link) => (
                <a
                  key={link.section}
                  href={link.href}
                  onClick={(e) => premiumScrollTo(e, link.href)}
                  className={`relative flex items-center justify-center text-[13px] font-medium px-4 py-2 rounded-full transition-colors duration-200 tracking-wide cursor-pointer ${
                    activeSection === link.section
                      ? 'text-foreground bg-background/80 shadow-sm border border-border'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/40 border border-transparent'
                  }`}
                >
                  {link.label}
                </a>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 md:gap-3 relative z-10 shrink-0">

            {/* Theme toggle — expands circular royalty reveal */}
            <motion.button
              type="button"
              onClick={(e) => onToggleTheme?.(e)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9, rotate: 20 }}
              className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full border border-border bg-secondary/80 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden"
            >
              <motion.span
                className="absolute inset-0 rounded-full bg-primary/20"
                initial={false}
                animate={{ scale: [1, 1.6, 1], opacity: [0, 0.5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.span
                    key="sun"
                    initial={{ opacity: 0, rotate: -90, scale: 0.4, y: 8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.4, y: -8 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    className="relative z-10"
                  >
                    <Sun className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ opacity: 0, rotate: 90, scale: 0.4, y: 8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.4, y: -8 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    className="relative z-10"
                  >
                    <Moon className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <a
              href="#contact"
              onClick={(e) => premiumScrollTo(e, '#contact')}
              className="hidden md:inline-flex items-center justify-center h-10 px-5 lg:px-6 rounded-full bg-foreground text-background text-[13px] font-semibold hover:bg-primary hover:text-primary-foreground border border-transparent transition-colors shrink-0 cursor-pointer"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Let&apos;s Talk
            </a>

            <a
              href="#contact"
              onClick={(e) => premiumScrollTo(e, '#contact')}
              className="btn-primary md:hidden relative inline-flex items-center justify-center gap-1.5 h-[34px] px-4 rounded-xl text-[10px] tracking-[0.12em] shrink-0 cursor-pointer"
            >
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              HIRE ME
            </a>

            <div className="w-10 h-10 rounded-full border border-border overflow-hidden ml-1 hidden md:block ring-1 ring-primary/20 shrink-0">
              <img src="/profile.jpg" alt="Bipul Roy" className="w-full h-full object-cover" />
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="relative flex flex-col items-center justify-center w-[34px] h-[34px] md:w-10 md:h-10 rounded-xl bg-secondary border border-border text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 focus:outline-none active:scale-90 lg:hidden shrink-0"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <div className="relative w-[13px] h-[9px] flex flex-col justify-between">
                <span
                  className={`h-[1.5px] bg-current rounded-full origin-center block transition-transform duration-200 ${
                    mobileOpen ? 'translate-y-[3.75px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`h-[1.5px] bg-current rounded-full origin-right block transition-all duration-200 ${
                    mobileOpen ? 'scale-x-0 opacity-0' : 'scale-x-60 opacity-50'
                  }`}
                />
                <span
                  className={`h-[1.5px] bg-current rounded-full origin-center block transition-transform duration-200 ${
                    mobileOpen ? '-translate-y-[3.75px] -rotate-45' : ''
                  }`}
                />
              </div>
            </button>
          </div>
          </nav>
        </div>
      </div>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[45] lg:hidden flex flex-col items-center justify-center pointer-events-auto"
          >
            {/* Super premium frosted glass backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-background/90 backdrop-blur-3xl saturate-150"
            />
            
            {/* Cinematic background light pools */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/20 blur-[80px]" 
               />
               <motion.div 
                 animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                 transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-primary/10 blur-[100px]" 
               />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-5 w-full px-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.section}
                  href={link.href}
                  onClick={(e) => premiumScrollTo(e, link.href)}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                  className={`block py-2 text-3xl sm:text-4xl font-bold tracking-tight uppercase cursor-pointer ${
                    activeSection === link.section
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary'
                  }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {link.label}
                </motion.a>
              ))}

              <div className="h-px w-4/5 max-w-xs bg-gradient-to-r from-transparent via-border to-transparent my-3" />

              <motion.a
                href="#contact"
                onClick={(e) => premiumScrollTo(e, '#contact')}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="btn-primary mt-1 inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold tracking-wide uppercase cursor-pointer"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Start a Project
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
