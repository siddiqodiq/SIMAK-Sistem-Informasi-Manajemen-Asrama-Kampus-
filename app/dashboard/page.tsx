"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Home, FileText, PlusCircle, Clock, AlertCircle } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { fetchApi } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Menunggu
        </Badge>
      )
    case "IN_PROGRESS":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Diproses
        </Badge>
      )
    case "COMPLETED":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          Selesai
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const data = await fetchApi("/api/dashboard")
        setDashboardData(data)
        setError("")
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Gagal mengambil data dashboard. Silakan coba lagi nanti.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const { user, reports } = dashboardData || {}

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader user={user} />

      <div className="flex">
        <DashboardSidebar activeItem="dashboard" />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Selamat datang kembali, {user?.name}</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Ringkasan</TabsTrigger>
              <TabsTrigger value="reports">Laporan Saya</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Kamar</CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user?.room?.number}</div>
                    <p className="text-xs text-muted-foreground">
                      Gedung {user?.room?.building}, Lantai {user?.room?.floor}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reports?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">Laporan kerusakan yang telah dibuat</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Status Terbaru</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      <StatusBadge status={reports?.[0]?.status || "N/A"} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Laporan terakhir: {reports?.[0]?.title || "Tidak ada"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Laporan Terbaru</CardTitle>
                  <CardDescription>Daftar 3 laporan kerusakan terbaru yang Anda buat</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports?.slice(0, 3).map((report) => (
                      <div
                        key={report.id}
                        className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div>
                          <h3 className="font-medium">{report.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{report.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(report.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <StatusBadge status={report.status} />
                      </div>
                    ))}
                    {(!reports || reports.length === 0) && (
                      <p className="text-center text-muted-foreground">Belum ada laporan yang dibuat</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button asChild>
                  <Link href="/dashboard/report">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Buat Laporan Baru
                  </Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Semua Laporan</CardTitle>
                      <CardDescription>Daftar semua laporan kerusakan yang telah Anda buat</CardDescription>
                    </div>
                    <Button asChild>
                      <Link href="/dashboard/report">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Buat Laporan
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reports?.length > 0 ? (
                      reports.map((report) => (
                        <div
                          key={report.id}
                          className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div>
                            <h3 className="font-medium">{report.title}</h3>
                            <p className="text-sm text-muted-foreground">{report.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <p className="text-xs text-muted-foreground">
                                Dibuat:{" "}
                                {new Date(report.createdAt).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                              {report.status === "IN_PROGRESS" || report.status === "COMPLETED" ? (
                                <p className="text-xs text-muted-foreground">
                                  Diperbarui:{" "}
                                  {new Date(report.updatedAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <StatusBadge status={report.status} />
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/report/${report.id}`}>Detail</Link>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Belum ada laporan yang dibuat</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

