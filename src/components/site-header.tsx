import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { ReactNode } from "react"

export function SiteHeader({
  title = "Dashboard",
  actions,
  onToggleSidebar,
}: {
  title?: string
  actions?: ReactNode
  onToggleSidebar?: () => void
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center border-b border-border/70 bg-background/85 px-3 sm:px-6 backdrop-blur-md transition-colors">
      <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <SidebarTrigger
            onClick={onToggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-card hover:bg-accent hover:text-accent-foreground text-foreground transition-all cursor-pointer"
          />
          <Separator
            orientation="vertical"
            className="h-4 bg-border/60 hidden sm:block"
          />
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground hidden md:inline-block">
              Studio /
            </span>
            <h1 className="truncate text-sm sm:text-base font-semibold tracking-tight text-foreground dark:text-white">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      </div>
    </header>
  )
}

