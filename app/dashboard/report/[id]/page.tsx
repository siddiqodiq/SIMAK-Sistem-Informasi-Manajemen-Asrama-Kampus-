// app/dashboard/report/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { fetchApi } from "@/lib/api"
import { ArrowLeft } from "lucide-react"

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [report, setReport] = useState<any>(null)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await fetchApi(`/api/reports/${params.id}`)
        setReport(data)
      } catch (err) {
        console.error("Error fetching report:", err)
        toast({
          title: "Gagal memuat laporan",
          description: "Terjadi kesalahan saat mengambil data laporan",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [params.id])

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updatedReport = await fetchApi(`/api/reports/${params.id}`, {
        method: "PATCH",
        body: { status: newStatus },
      })

      setReport(updatedReport)
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

  const handleAddComment = async () => {
    if (!comment.trim()) return

    try {
      const newComment = await fetchApi(`/api/reports/${params.id}/comments`, {
        method: "POST",
        body: { message: comment },
      })

      setReport((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }))

      setComment("")
      toast({
        title: "Komentar ditambahkan",
        description: "Komentar berhasil dikirim",
      })
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Gagal menambahkan komentar",
        description: "Terjadi kesalahan saat mengirim komentar",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!report) {
    return <div className="flex items-center justify-center min-h-screen">Laporan tidak ditemukan</div>
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader user={session?.user} />

      <div className="flex">
        <DashboardSidebar activeItem="report" userRole={session?.user?.role} />

        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Detail Laporan</h1>
              <p className="text-muted-foreground">Laporan #{report.id}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{report.title}</CardTitle>
                      <CardDescription>
                        Dibuat pada {new Date(report.createdAt).toLocaleDateString("id-ID")}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{report.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Deskripsi</h3>
                    <p className="text-sm">{report.description}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Kategori</h3>
                    <p className="text-sm">{report.category}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Nomor Kamar yang Dilaporkan</h3>
                    <p className="text-sm">
                      Gedung {report.reportedBuilding}, Kamar {report.reportedRoomNumber}
                    </p>
                  </div>

                  {
  report.images.length > 0 ? (
    <div>
      <h3 className="font-medium mb-2">Foto Kerusakan</h3>
      <div className="grid grid-cols-2 gap-2">
        {report.images.map((image: any, index: number) => (
          <img
            key={index}
            src={image.url}
            alt={`Foto kerusakan ${index + 1}`}
            className="rounded-md w-full h-48 object-cover"
          />
        ))}
      </div>
    </div>
  ) : (
    <div>
      <h3 className="font-medium mb-2">Foto Kerusakan</h3>
      <p className="text-sm text-muted-foreground">Tidak ada gambar yang diupload.</p>
    </div>
  )
}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Diskusi</CardTitle>
                  <CardDescription>
                    Komunikasi dengan tim PART mengenai laporan ini
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {report.comments.map((comment: any) => (
                    <div
                      key={comment.id}
                      className={`flex gap-4 ${
                        comment.user.role !== "USER" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          comment.user.role !== "USER"
                            ? "bg-muted"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{comment.user.name}</p>
                          <p className="text-xs opacity-70">
                            {new Date(comment.createdAt).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <p className="text-sm">{comment.message}</p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Tulis pesan..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <Button
                        className="self-end"
                        onClick={handleAddComment}
                        disabled={!comment.trim()}
                      >
                        Kirim
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar untuk admin */}
            {session?.user?.role === "ADMIN" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status Laporan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={report.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Menunggu</SelectItem>
                        <SelectItem value="IN_PROGRESS">Diproses</SelectItem>
                        <SelectItem value="COMPLETED">Selesai</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}