import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { PanelLeftIcon } from "lucide-react"
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
    <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center border-b border-border/70 bg-background/[0.85] px-3 backdrop-blur-md transition-colors sm:px-5 lg:px-6">
      <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {onToggleSidebar && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onToggleSidebar}
              aria-label="Toggle navigation"
              aria-expanded={undefined}
              className="h-9 w-9 shrink-0 rounded-lg border-border/70 bg-card text-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
            >
              <PanelLeftIcon className="h-4 w-4" />
            </Button>
          )}
          <Separator
            orientation="vertical"
            className="hidden h-4 bg-border/60 sm:block"
          />
          <div className="flex min-w-0 items-center gap-2">
            <span className="hidden font-mono text-xs uppercase tracking-wider text-muted-foreground md:inline-block">
              Studio /
            </span>
            <h1 className="truncate text-sm font-semibold tracking-tight text-foreground dark:text-white sm:text-base">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      </div>
    </header>
  )
}
