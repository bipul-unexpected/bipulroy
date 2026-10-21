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
  const content = (
    <div className="flex h-full w-full flex-col justify-between overflow-y-auto p-4">
      {/* Brand & Studio Title */}
      <div>
        <div className="flex items-center justify-between pb-5 border-b border-border/60">
          <a
            href="#admin"
            className="flex items-center gap-3 group focus:outline-none"
            onClick={() => onCloseMobile?.()}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm transition-transform group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-foreground dark:text-white flex items-center gap-1.5">
                Bipul Roy Studio
              </div>
              <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                Admin Console
              </div>
            </div>
          </a>

          {/* Close button on mobile */}
          {openMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:text-foreground dark:hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content collections navigation */}
        <div className="mt-6">
          <div className="px-2 mb-2.5 text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-muted-foreground dark:text-zinc-400">
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-white dark:text-zinc-950"
                          : "text-muted-foreground group-hover:text-foreground dark:text-zinc-400 dark:group-hover:text-white"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`ml-2 text-[11px] font-mono px-2 py-0.5 rounded-lg border tabular-nums transition-colors ${
                      isActive
                        ? "bg-white/20 text-white border-white/30 dark:bg-zinc-950/15 dark:text-zinc-950 dark:border-zinc-950/20 font-bold"
                        : "bg-muted/60 text-muted-foreground border-border/60 group-hover:text-foreground dark:bg-white/5 dark:text-zinc-400 dark:border-white/10 dark:group-hover:text-white"
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
        <div className="mt-8">
          <div className="px-2 mb-2.5 text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-muted-foreground dark:text-zinc-400">
            Workspace
          </div>
          <nav className="space-y-1">
            <a
              href="#admin"
              onClick={() => onCloseMobile?.()}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/70 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard Overview</span>
            </a>
            <a
              href="#content-editor"
              onClick={() => onCloseMobile?.()}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/70 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Content Editor</span>
            </a>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/70 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="h-4 w-4" />
                <span>View Public Site</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-muted/60 dark:bg-white/5 px-1.5 py-0.5 rounded text-muted-foreground">
                LIVE
              </span>
            </a>
          </nav>
        </div>
      </div>

      {/* User profile and theme toggle footer */}
      <div className="mt-8 pt-4 border-t border-border/60 space-y-3">
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-border/70 bg-card hover:bg-accent text-xs font-medium text-foreground transition-all dark:border-white/10 dark:hover:bg-white/5"
          >
            <span className="flex items-center gap-2">
              {isDarkMode ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-indigo-500" />}
              <span>{isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
            </span>
            <span className="text-[10px] font-mono uppercase text-muted-foreground">
              {isDarkMode ? "DARK" : "LIGHT"}
            </span>
          </button>
        )}

        <div className="flex items-center gap-3 p-2 rounded-xl bg-card border border-border/70 dark:border-white/10">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || "Admin"}
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-border"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground dark:bg-white dark:text-black">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
          )}
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-xs font-semibold text-foreground dark:text-white">
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
      {/* Desktop Sidebar: sleek fixed/sticky side panel */}
      <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col border-r border-border/70 bg-sidebar dark:bg-[#0c0d12] dark:border-white/10 h-screen sticky top-0 z-20">
        {content}
      </aside>

      {/* Mobile Sidebar: smooth slide-in drawer */}
      {openMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          {/* Sliding panel */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-sidebar dark:bg-[#0c0d12] border-r border-border/80 dark:border-white/10 shadow-2xl transition-transform ease-out duration-300">
            {content}
          </div>
        </div>
      )}
    </>
  )
}
