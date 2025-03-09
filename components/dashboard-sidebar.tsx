// components/dashboard-sidebar.tsx
"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, FileText, Settings, Users, LogOut, X } from "lucide-react"

interface DashboardSidebarProps {
  activeItem?: string
  isMobile?: boolean
  onClose?: () => void
  userRole?: string
}

export default function DashboardSidebar({
  activeItem = "dashboard",
  isMobile = false,
  onClose,
  userRole
}: DashboardSidebarProps) {
  const sidebarItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      id: "dashboard",
      roles: ["USER", "ADMIN", "STAFF"]
    },
    {
      name: "Laporan",
      href: "/dashboard/report",
      icon: FileText,
      id: "report",
      roles: ["USER", "ADMIN", "STAFF"]
    },
    {
      name: "Admin PART",
      href: "/dashboard/admin",
      icon: Users,
      id: "admin",
      roles: ["ADMIN"]
    },
    {
      name: "Pengaturan",
      href: "/dashboard/settings",
      icon: Settings,
      id: "settings",
      roles: ["USER", "ADMIN", "STAFF"]
    },
  ]

  return (
    <div className={cn(
      "flex flex-col border-r bg-muted/30 h-[calc(100vh-4rem)] w-48", // Lebar sidebar lebih kecil
      isMobile ? "fixed inset-0 z-50 bg-background w-40" : "sticky top-16"
    )}>
      {isMobile && (
        <div className="flex items-center justify-between p-3 border-b">
          <span className="font-semibold text-lg">SIMAK</span>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <div className="flex-1 overflow-auto py-4 px-2">
        <nav className="space-y-1">
          {sidebarItems
            .filter(item => item.roles.includes(userRole || "USER"))
            .map((item) => (
              <Button
                key={item.id}
                variant={activeItem === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start px-3 py-2 text-sm",
                  activeItem === item.id ? "bg-secondary text-secondary-foreground" : "hover:bg-muted",
                )}
                asChild
                onClick={isMobile && onClose ? onClose : undefined}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
        </nav>
      </div>

      <div className="p-3 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 px-3 py-2 text-sm"
          asChild
        >
          <Link href="/login">
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Link>
        </Button>
      </div>
    </div>
  )
}
