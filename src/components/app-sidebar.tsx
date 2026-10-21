import * as React from "react"
import {
  BriefcaseBusiness,
  FileText,
  Images,
  Wrench,
  GraduationCap,
  Handshake,
  Quote,
  LayoutDashboard,
  ExternalLink,
  FolderIcon,
  Sun,
  Moon,
  X,
  Sparkles,
  Edit3,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const collectionIcons: Record<string, React.ElementType> = {
  projects: BriefcaseBusiness,
  articles: FileText,
  gallery: Images,
  tools: Wrench,
  experience: GraduationCap,
  services: Handshake,
  testimonials: Quote,
}

export type AppSidebarProps = {
  collections?: { value: string; label: string }[]
  activeCollection?: string
  onCollectionChange?: (value: string) => void
  counts?: Record<string, number>
  user?: { name: string; email: string; avatar?: string }
  openMobile?: boolean
  onCloseMobile?: () => void
  isDarkMode?: boolean
  onToggleTheme?: () => void
  variant?: string
}

export function AppSidebar({
  collections = [],
  activeCollection,
  onCollectionChange,
  counts = {},
  user,
  openMobile = false,
  onCloseMobile,
  isDarkMode = false,
  onToggleTheme,
}: AppSidebarProps) {
  // Escape closes the mobile drawer, and the page behind it must not scroll.
  React.useEffect(() => {
    if (!openMobile) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseMobile?.()
    }
    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [openMobile, onCloseMobile])

  const content = (
    <div className="flex h-full w-full flex-col justify-between overflow-y-auto overscroll-contain px-3 py-4 sm:px-4">
      {/* Brand & Studio Title */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-sidebar-border/70 pb-4">
          <a
            href="#admin"
            className="flex min-w-0 items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            onClick={() => onCloseMobile?.()}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate text-sm font-bold tracking-tight text-sidebar-foreground">
                Bipul Roy Studio
              </div>
              <div className="truncate font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Admin Console
              </div>
            </div>
          </a>

          {/* Close button on mobile */}
          {openMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-accent text-sidebar-foreground transition-colors hover:bg-sidebar-accent/80 md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content collections navigation */}
        <div className="mt-5">
          <div className="mb-2 px-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Content Collections
          </div>
          <nav className="space-y-1">
            {collections.map((item) => {
              const Icon = collectionIcons[item.value] || FolderIcon
              const isActive = activeCollection === item.value
              const count = counts[item.value] ?? 0

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onCollectionChange?.(item.value)
                    onCloseMobile?.()
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span className="flex min-w-0 items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <Badge
                    variant="outline"
                    className={`ml-1 shrink-0 rounded-md border px-1.5 py-0 font-mono text-[11px] tabular-nums transition-colors ${
                      isActive
                        ? "border-primary-foreground/25 bg-primary-foreground/[0.15] text-primary-foreground"
                        : "border-sidebar-border bg-sidebar-accent text-muted-foreground"
                    }`}
                  >
                    {count}
                  </Badge>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Workspace Quick Links */}
        <div className="mt-7">
          <div className="mb-2 px-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Workspace
          </div>
          <nav className="space-y-1">
            <a
              href="#admin"
              onClick={() => onCloseMobile?.()}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Dashboard Overview</span>
            </a>
            <a
              href="#content-editor"
              onClick={() => onCloseMobile?.()}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Edit3 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Content Editor</span>
            </a>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>View Public Site</span>
              </span>
              <span className="shrink-0 rounded bg-sidebar-accent px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                Live
              </span>
            </a>
          </nav>
        </div>
      </div>

      {/* User profile and theme toggle footer */}
      <div className="mt-7 space-y-3 border-t border-sidebar-border/70 pt-4">
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex w-full items-center justify-between gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/60 px-3 py-2 text-xs font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            <span className="flex min-w-0 items-center gap-2">
              {isDarkMode ? (
                <Sun className="h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="h-3.5 w-3.5 shrink-0 text-sky-500" aria-hidden="true" />
              )}
              <span className="truncate">
                {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </span>
            </span>
            <span className="shrink-0 font-mono text-[10px] uppercase text-muted-foreground">
              {isDarkMode ? "Dark" : "Light"}
            </span>
          </button>
        )}

        <div className="flex items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-2">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || "Admin"}
              className="h-8 w-8 shrink-0 rounded-md object-cover ring-1 ring-sidebar-border"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
          )}
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-xs font-semibold text-sidebar-foreground">
              {user?.name || "Portfolio Admin"}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {user?.email || "admin@bipul.tech"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar: fixed-width, sticky, full-height rail */}
      <aside className="sticky top-0 z-20 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex lg:w-72">
        {content}
      </aside>

      {/* Mobile Sidebar: slide-in drawer with scrim */}
      {openMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 animate-in fade-in-0 duration-200 bg-slate-950/70 backdrop-blur-sm"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="fixed inset-y-0 left-0 flex w-72 max-w-[85vw] animate-in slide-in-from-left duration-300 flex-col border-r border-sidebar-border bg-sidebar shadow-2xl"
          >
            {content}
          </div>
        </div>
      )}
    </>
  )
}
