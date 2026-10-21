"use client"

import {
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Handshake,
  Images,
  Quote,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"

export type DashboardStats = {
  projects: number
  testimonials: number
  articles: number
  gallery: number
  tools: number
  experience: number
  services: number
}

const statCards: { key: keyof DashboardStats; label: string; icon: LucideIcon }[] = [
  { key: "projects", label: "Projects", icon: BriefcaseBusiness },
  { key: "testimonials", label: "Testimonials", icon: Quote },
  { key: "articles", label: "Articles", icon: FileText },
  { key: "gallery", label: "Gallery", icon: Images },
  { key: "tools", label: "Tools", icon: Wrench },
  { key: "experience", label: "Experience", icon: GraduationCap },
  { key: "services", label: "Services", icon: Handshake },
]

export function SectionCards({
  stats,
  activeKind,
  onSelectKind,
}: {
  stats: DashboardStats
  activeKind?: string
  onSelectKind?: (kind: keyof DashboardStats) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
      {statCards.map(({ key, label, icon: Icon }) => {
        const isActive = activeKind === key
        return (
          <button
            type="button"
            key={key}
            onClick={() => onSelectKind?.(key)}
            className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl group transition-transform duration-150 active:scale-[0.98]"
          >
            <Card
              className={`min-w-0 p-3.5 sm:p-4 rounded-2xl transition-all duration-200 border cursor-pointer ${
                isActive
                  ? "border-primary/80 dark:border-white bg-primary/5 dark:bg-white/10 shadow-sm ring-1 ring-primary/40 dark:ring-white/40"
                  : "border-border/70 bg-card hover:border-border hover:bg-muted/40 dark:hover:border-white/20 dark:hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className={`truncate text-xs font-medium transition-colors ${
                  isActive ? "text-primary dark:text-white font-semibold" : "text-muted-foreground group-hover:text-foreground dark:group-hover:text-white"
                }`}>
                  {label}
                </span>
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground dark:bg-white dark:text-black"
                    : "bg-secondary text-muted-foreground group-hover:text-foreground dark:bg-white/5 dark:text-zinc-300 dark:group-hover:text-white"
                }`}>
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <span className={`text-2xl font-bold tabular-nums tracking-tight sm:text-3xl ${
                  isActive ? "text-primary dark:text-white" : "text-foreground dark:text-white"
                }`}>
                  {stats[key] ?? 0}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                  total
                </span>
              </div>
            </Card>
          </button>
        )
      })}
    </div>
  )
}

