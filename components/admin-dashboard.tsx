// components/admin-dashboard.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, MessageSquare, Eye, PieChart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AdminDashboardProps {
  initialReports: any[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function AdminDashboard({ initialReports }: AdminDashboardProps) {
  const router = useRouter()
  const [reports, setReports] = useState(initialReports)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({
    byBuilding: [],
    byCategory: [],
    byMonth: [],
    byStatus: []
  })
  const [activeTab, setActiveTab] = useState("overview")

  // Fetch all reports and statistics on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch reports
        const reportsData = await fetchApi("/api/dashboard")
        setReports(reportsData.reports)
        
        // Fetch statistics
        const statsData = await fetchApi("/api/reports/stats")
        setStats(statsData)
        
        setError("")
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Gagal mengambil data. Silakan coba lagi nanti.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      const updatedReport = await fetchApi(`/api/reports/${reportId}`, {
        method: "PATCH",
        body: { status: newStatus },
      })

      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      )

      toast({
        title: "Status diperbarui",
        description: `Status laporan berhasil diubah menjadi ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating report status:", error)
      toast({
        title: "Gagal memperbarui status",
        description: "Terjadi kesalahan saat mengubah status laporan",
        variant: "destructive",
      })
    }
  }

  const handleViewDetails = (reportId: string) => {
    router.push(`/dashboard/report/${reportId}`)
  }


  const renderStatusChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Status Perbaikan
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={stats.byStatus}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
              nameKey="status"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {stats.byStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderStatusChart()}
        {/* Bar Chart - Reports by Building */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Laporan per Gedung
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byBuilding}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="building" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart - Reports by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Laporan per Kategori
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={stats.byCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="category"
                label
              >
                {stats.byCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart - Reports by Month */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Laporan per Bulan
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.byMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )

  const renderReportList = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Semua Laporan Kerusakan</span>
          <span className="text-sm text-muted-foreground">
            Total: {reports.length} laporan
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
      <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col md:flex-row items-start justify-between border-b pb-4 last:border-0 gap-4"
            >
              <div className="flex-1">
                <h3 className="font-medium">{report.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {report.description}
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>
                    Dilaporkan oleh: {report.user.name} (Kamar {report.room.number})
                  </p>
                  <p>
                    Dibuat: {new Date(report.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <Select
                  value={report.status}
                  onValueChange={(value) => handleStatusChange(report.id, value)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Menunggu</SelectItem>
                    <SelectItem value="IN_PROGRESS">Diproses</SelectItem>
                    <SelectItem value="COMPLETED">Selesai</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(report.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Detail
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(report.id)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Diskusi
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Belum ada laporan yang dibuat</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )


  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="reports">Semua Laporan Kerusakan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="reports">
          {renderReportList()}
        </TabsContent>
      </Tabs>
    </div>
  )
}

