// components/admin-dashboard.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CurrencyInput from 'react-currency-input-field'
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, MessageSquare, Eye, PieChart, ArrowUpDown, Clock } from "lucide-react"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"


interface AdminDashboardProps {
  initialReports: any[]
}

interface RepairCostByMonthChartProps {
  data: { month: string; totalCost: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

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

export default function AdminDashboard({ initialReports }: AdminDashboardProps) {
  const router = useRouter()
  const [reports, setReports] = useState(initialReports)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({
    byBuilding: [],
    byCategory: [],
    byMonth: [],
    byStatus: [],
    repairCostByYear: [],
    repairCostByMonth: [],

    
  })
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' })
  const [activeTab, setActiveTab] = useState("overview")
  const handleViewDetails = (reportId: string) => {
    router.push(`/dashboard/report/${reportId}`)
  }
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
  
      // Update state reports
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      )
  
      toast({
        title: "Status diperbarui",
        description: `Status laporan berhasil diubah menjadi ${newStatus}`,
      })
  
      // Jika status diubah menjadi COMPLETED, reset biaya perbaikan
      if (newStatus === 'COMPLETED') {
        setReports((prev) =>
          prev.map((report) =>
            report.id === reportId ? { ...report, repairCost: 0 } : report
          )
        )
      }
    } catch (error) {
      console.error("Error updating report status:", error)
      toast({
        title: "Gagal memperbarui status",
        description: "Terjadi kesalahan saat mengubah status laporan",
        variant: "destructive",
      })
    }
  }
  
  const handleRepairCostChange = async (reportId: string, value: string | undefined) => {
    try {
      const numericValue = value ? parseFloat(value.replace(/[^0-9]/g, '')) : 0
  
      const updatedReport = await fetchApi(`/api/reports/${reportId}`, {
        method: "PATCH",
        body: { repairCost: numericValue },
      })
  
      setReports(prev =>
        prev.map(report =>
          report.id === reportId ? { ...report, repairCost: updatedReport.repairCost } : report
        )
      )
  
      toast({
        title: "Biaya perbaikan diperbarui",
        description: `Biaya perbaikan berhasil diupdate`,
      })
    } catch (error) {
      console.error("Error updating repair cost:", error)
      toast({
        title: "Gagal memperbarui biaya",
        description: "Terjadi kesalahan saat mengupdate biaya perbaikan",
        variant: "destructive",
      })
    }
  }
  const renderStatusDropdown = (reportId: string, currentStatus: string) => (
    <Select
      value={currentStatus}
      onValueChange={(value) => handleStatusChange(reportId, value)}
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
  )

  const calculateRepairDuration = (report: any) => {
    if (report.status !== 'COMPLETED' || !report.completedAt) return '-'
    
    const start = new Date(report.createdAt)
    const end = new Date(report.completedAt)
    const diff = Math.abs(end.getTime() - start.getTime())
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    return `${days} hari ${hours} jam`
  }
  const sortReports = (key: string) => {
  let direction = 'asc'
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc'
  }
  setSortConfig({ key, direction })

  setReports(prev => [...prev].sort((a, b) => {
    // Handle sorting untuk nested object (room.building dan room.number)
    if (key.includes('room.')) {
      const nestedKey = key.split('.')[1] // Ambil key setelah 'room.'
      if (a.room[nestedKey] < b.room[nestedKey]) return direction === 'asc' ? -1 : 1
      if (a.room[nestedKey] > b.room[nestedKey]) return direction === 'asc' ? 1 : -1
      return 0
    }

    // Handle sorting untuk field biasa
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
    return 0
  }))
}

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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">
                  <button
                    onClick={() => sortReports('createdAt')}
                    className="flex items-center gap-1"
                  >
                    Tanggal
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="p-2">
                  <button
                    onClick={() => sortReports('room.building')}
                    className="flex items-center gap-1"
                  >
                    Gedung
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="p-2">
                  <button
                    onClick={() => sortReports('room.number')}
                    className="flex items-center gap-1"
                  >
                    Nomor Kamar
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="p-2">Judul</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">
                  <button
                    onClick={() => sortReports('status')}
                    className="flex items-center gap-1"
                  >
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="p-2">Biaya Perbaikan</th>
                <th className="p-2">Durasi Perbaikan</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-muted/50">
                  <td className="p-2">
                    {new Date(report.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-2">{report.room.building}</td>
                  <td className="p-2">{report.room.number}</td> {/* Nomor Kamar */}
                  <td className="p-2">{report.title}</td>
                  <td className="p-2">{report.category}</td>
                  <td className="p-2">
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
                  </td>
            
                  <td className="p-2">
                    <CurrencyInput
                      id="repairCost"
                      name="repairCost"
                      placeholder="Rp 0"
                      value={report.repairCost || 0}
                      onValueChange={(value) => handleRepairCostChange(report.id, value)}
                      className="w-32 px-2 py-1 border rounded-md"
                      disabled={report.status !== 'COMPLETED'}
                      prefix="Rp "
                      decimalSeparator=","
                      groupSeparator="."
                      decimalsLimit={0} // Tidak ada desimal
                    />
                  </td>
                  <td className="p-2">
                    {calculateRepairDuration(report)}
                  </td>
                  <td className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(report.id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )

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

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Total Biaya Perbaikan per Bulan (Tahun Ini)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.repairCostByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value) => `Rp ${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value) => `Rp ${value.toLocaleString()}`}
            />
            <Legend />
            <Bar dataKey="totalCost" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

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