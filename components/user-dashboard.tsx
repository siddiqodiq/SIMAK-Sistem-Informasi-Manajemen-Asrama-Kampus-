// components/user-dashboard.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { fetchApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

interface UserDashboardProps {
  user: any
  reports: any[]
}

export default function UserDashboard({ user, reports: initialReports }: UserDashboardProps) {
  const [reports, setReports] = useState(initialReports)
  const [isLoading, setIsLoading] = useState(false)

  // Fungsi untuk memuat ulang laporan
  const fetchReports = async () => {
    try {
      setIsLoading(true)
      const data = await fetchApi("/api/dashboard")
      setReports(data.reports)
    } catch (err) {
      console.error("Error fetching reports:", err)
      toast({
        title: "Gagal memuat laporan",
        description: "Terjadi kesalahan saat mengambil data laporan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Memuat ulang laporan setiap 10 detik
  useEffect(() => {
    const interval = setInterval(fetchReports, 10000) // Refresh setiap 10 detik
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laporan Saya</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <h3 className="font-medium">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {report.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs text-muted-foreground">
                      Kamar: {report.room?.building} {report.room?.number} •{" "}
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
                  <Badge variant="outline">
                    {report.status === "PENDING"
                      ? "Menunggu"
                      : report.status === "IN_PROGRESS"
                      ? "Diproses"
                      : "Selesai"}
                  </Badge>
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

        <div className="mt-6">
          <Button asChild>
            <Link href="/dashboard/report">Buat Laporan Baru</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}