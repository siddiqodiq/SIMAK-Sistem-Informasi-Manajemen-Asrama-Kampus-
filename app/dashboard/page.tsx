// app/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"
import AdminDashboard from "@/components/admin-dashboard"
import UserDashboard from "@/components/user-dashboard"
import { fetchApi } from "@/lib/api"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [dashboardData, setDashboardData] = useState<{
    user?: any
    reports?: any[]
    isAdmin?: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await fetchApi("/api/dashboard")
        setDashboardData(data)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        toast({
          title: "Gagal memuat data",
          description: "Terjadi kesalahan saat mengambil data dashboard",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Fallback jika data user belum tersedia
  const user = dashboardData?.user || session?.user || {
    name: "Pengguna",
    email: "email@example.com",
    role: "USER",
    room: {
      number: "N/A",
      building: "N/A",
    },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Gagal memuat data dashboard</p>
      </div>
    )
  }

  const { reports, isAdmin } = dashboardData

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader user={user} />

      <div className="flex">
        <DashboardSidebar activeItem="dashboard" userRole={user?.role} />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Selamat datang kembali, {user?.name}
            </p>
          </div>

          {isAdmin ? (
            <AdminDashboard reports={reports} />
          ) : (
            <UserDashboard user={user} reports={reports} />
          )}
        </main>
      </div>
    </div>
  )
}