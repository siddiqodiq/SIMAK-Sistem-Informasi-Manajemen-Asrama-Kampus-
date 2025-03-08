"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { fetchApi } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Lightbox from "@/components/lightbox"
import Image from "next/image"

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "PENDING":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Menunggu</Badge>
    case "IN_PROGRESS":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Diproses</Badge>
    case "COMPLETED":
      return <Badge variant="outline" className="bg-green-100 text-green-800">Selesai</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [report, setReport] = useState<any>(null)
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")

  // Fetch report data from API
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true)
        const data = await fetchApi(`/api/reports/${params.id}`)
        setReport(data)
        setError("")
      } catch (err) {
        console.error("Error fetching report:", err)
        setError("Gagal memuat data laporan")
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [params.id])

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return

    try {
      setIsLoading(true)
      const response = await fetchApi(`/api/reports/${params.id}/comments`, {
        method: "POST",
        body: { message: comment },
      })

      if (response.id) {
        setComment("")
        // Refresh report data to show new comment
        const updatedReport = await fetchApi(`/api/reports/${params.id}`)
        setReport(updatedReport)
      }
    } catch (err) {
      console.error("Error submitting comment:", err)
      setError("Gagal mengirim komentar")
    } finally {
      setIsLoading(false)
    }
  }

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setSelectedImage("")
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Memuat...</div>
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

  if (!report) {
    return <div className="flex items-center justify-center min-h-screen">Laporan tidak ditemukan</div>
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader user={{ name: "User", email: "user@example.com" }} />

      <div className="flex">
        <DashboardSidebar activeItem="report" />

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
                    <StatusBadge status={report.status} />
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

                  {report.images.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Foto Kerusakan</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {report.images.map((image: any, index: number) => (
                          <div
                            key={index}
                            className="cursor-pointer"
                            onClick={() => openLightbox(image.url)}
                          >
                            <Image
                              src={image.url}
                              alt={`Foto kerusakan ${index + 1}`}
                              width={1000}
                              height={1000}
                              className="rounded-md w-full h-48 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Diskusi</CardTitle>
                  <CardDescription>Komunikasi dengan tim PART mengenai laporan ini</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {report.comments.map((comment: any) => (
                    <div key={comment.id} className={`flex gap-4 ${comment.user.role !== "USER" ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          comment.user.role !== "USER" ? "bg-muted" : "bg-primary text-primary-foreground"
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
                        onClick={handleCommentSubmit}
                        disabled={!comment.trim() || isLoading}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Kirim
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar dengan info status dan penanganan */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status Laporan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Status Saat Ini</h3>
                      <div className="mt-1">
                        <StatusBadge status={report.status} />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium">Terakhir Diperbarui</h3>
                      <p className="text-sm mt-1">
                        {new Date(report.updatedAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Lightbox untuk memperbesar gambar */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        imageUrl={selectedImage}
      />
    </div>
  )
}