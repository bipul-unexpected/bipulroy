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
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

export function SectionCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {statCards.map(({ key, label, icon: Icon }) => (
        <Card key={key} className="min-w-0 rounded-xl border-border/70 bg-card/90 shadow-sm transition-colors hover:border-primary/40">
          <CardHeader className="gap-2 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <CardDescription className="truncate text-xs font-medium">{label}</CardDescription>
              <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl font-semibold tabular-nums text-foreground sm:text-3xl">
              {stats[key]}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
