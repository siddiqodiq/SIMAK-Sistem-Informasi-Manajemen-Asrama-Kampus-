// components/admin-dashboard.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { Link } from "lucide-react"

interface AdminDashboardProps {
  reports: any[]
}

export default function AdminDashboard({ reports }: AdminDashboardProps) {
  const [localReports, setLocalReports] = useState(reports)

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      const updatedReport = await fetchApi(`/api/reports/${reportId}`, {
        method: "PATCH",
        body: { status: newStatus },
      })

      setLocalReports((prev) =>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Semua Laporan Kerusakan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {localReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div>
                <h3 className="font-medium">{report.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {report.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Dilaporkan oleh: {report.user.name} (Kamar {report.room.number})
                </p>
              </div>

              <div className="flex items-center gap-4">
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

                <Button variant="outline" asChild>
                  <Link href={`/dashboard/report/${report.id}`}>Detail</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}