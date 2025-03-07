"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, FileText, Settings, Users, LogOut, X } from "lucide-react"

interface DashboardSidebarProps {
  activeItem?: string
  isMobile?: boolean
  onClose?: () => void
}

export default function DashboardSidebar({
  activeItem = "dashboard",
  isMobile = false,
  onClose,
}: DashboardSidebarProps) {
  const sidebarItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      id: "dashboard",
    },
    {
      name: "Laporan",
      href: "/dashboard/report",
      icon: FileText,
      id: "report",
    },
    {
      name: "Admin PART",
      href: "/dashboard/admin",
      icon: Users,
      id: "admin",
    },
    {
      name: "Pengaturan",
      href: "/dashboard/settings",
      icon: Settings,
      id: "settings",
    },
  ]

  return (
    <div className={cn("flex h-screen w-64 flex-col border-r bg-muted/30", isMobile && "h-full w-full")}>
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold text-xl">SIMAK</span>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}

      <div className="flex-1 overflow-auto py-6 px-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeItem === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                activeItem === item.id ? "bg-secondary text-secondary-foreground" : "hover:bg-muted",
              )}
              asChild
              onClick={isMobile && onClose ? onClose : undefined}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
          asChild
        >
          <Link href="/login">
            <LogOut className="mr-2 h-5 w-5" />
            Keluar
          </Link>
        </Button>
      </div>
    </div>
  )
}

