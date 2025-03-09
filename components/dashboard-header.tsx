// components/dashboard-header.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Menu, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import DashboardSidebar from "./dashboard-sidebar"
import { fetchApi } from "@/lib/api"

interface DashboardHeaderProps {
  user?: {
    name?: string
    email?: string
    role?: string
    room?: {
      number?: string
    }
  }
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Fungsi untuk mendapatkan inisial dari nama
  const getInitials = (name?: string) => {
    if (!name) return "U" // Fallback jika name undefined
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleLogout = async () => {
    try {
      await fetchApi("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <DashboardSidebar activeItem="dashboard" isMobile onClose={() => setIsOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-xl">SIMAK</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifikasi</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "Pengguna"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "email@example.com"}</p>
                  {user?.role && <p className="text-xs leading-none text-muted-foreground">{user.role}</p>}
                  {user?.room?.number && (
                    <p className="text-xs leading-none text-muted-foreground">Kamar {user.room.number}</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>Keluar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}