"use client"

import {
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Handshake,
  Images,
  Quote,
  Wrench,
  Layers,
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
  published,
  activeKind,
  onSelectKind,
}: {
  stats: DashboardStats
  published?: Partial<DashboardStats>
  activeKind?: string
  onSelectKind?: (kind: keyof DashboardStats) => void
}) {
  const total = statCards.reduce((sum, card) => sum + (stats[card.key] ?? 0), 0)
  const totalPublished = statCards.reduce(
    (sum, card) => sum + (published?.[card.key] ?? stats[card.key] ?? 0),
    0,
  )

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
      {/* Total across every collection */}
      <Card className="col-span-2 flex flex-col justify-between gap-3 rounded-xl border-primary/40 bg-primary p-4 text-primary-foreground shadow-sm sm:col-span-1 lg:col-span-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] opacity-90">
            Total Content
          </span>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/20">
            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-3xl font-bold tabular-nums tracking-tight sm:text-4xl">
            {total}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider opacity-80">
            items
          </span>
        </div>
        <p className="text-[11px] opacity-80">
          {totalPublished} published across {statCards.length} collections
        </p>
      </Card>

      {statCards.map(({ key, label, icon: Icon }) => {
        const isActive = activeKind === key
        const count = stats[key] ?? 0
        const live = published?.[key] ?? count
        return (
          <button
            type="button"
            key={key}
            onClick={() => onSelectKind?.(key)}
            aria-pressed={isActive}
            className="group min-w-0 rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <Card
              className={`min-w-0 rounded-xl p-3.5 transition-all duration-200 sm:p-4 ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border/70 bg-card hover:border-border hover:bg-accent/40"
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span
                  className={`truncate text-xs font-medium transition-colors ${
                    isActive
                      ? "font-semibold text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-secondary text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between gap-2">
                <span
                  className={`text-2xl font-bold tabular-nums tracking-tight sm:text-3xl ${
                    isActive ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {count}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider ${
                    isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  total
                </span>
              </div>
              <p
                className={`mt-1 text-[11px] ${
                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {live} published
              </p>
            </Card>
          </button>
        )
      })}
    </div>
  )
}
