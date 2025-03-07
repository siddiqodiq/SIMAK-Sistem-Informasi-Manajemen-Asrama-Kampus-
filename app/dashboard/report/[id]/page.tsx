"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Menunggu
        </Badge>
      )
    case "in-progress":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Diproses
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          Selesai
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Mock report data
  const report = {
    id: Number.parseInt(params.id),
    title: "Kerusakan Lampu Kamar",
    description:
      "Lampu kamar mati dan perlu diganti. Sudah dicoba untuk mengganti bohlam namun tetap tidak menyala. Sepertinya ada masalah pada fitting atau kabel listriknya.",
    status: "in-progress",
    category: "electrical",
    createdAt: "2023-05-15T10:30:00",
    updatedAt: "2023-05-16T14:20:00",
    images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    comments: [
      {
        id: 1,
        user: "PART Staff",
        message: "Laporan Anda telah diterima. Kami akan mengirimkan teknisi untuk memeriksa kerusakan.",
        createdAt: "2023-05-15T11:45:00",
        isStaff: true,
      },
      {
        id: 2,
        user: "Budi Santoso",
        message: "Terima kasih, mohon segera ditindaklanjuti.",
        createdAt: "2023-05-15T13:20:00",
        isStaff: false,
      },
      {
        id: 3,
        user: "PART Staff",
        message: "Teknisi akan datang besok pukul 10.00 WIB. Mohon ketersediaannya.",
        createdAt: "2023-05-15T15:10:00",
        isStaff: true,
      },
    ],
  }

  // Mock user data
  const user = {
    name: "Budi Santoso",
    email: "budi@example.com",
    room: "A-101",
  }

  const handleCommentSubmit = () => {
    if (!comment.trim()) return

    setIsLoading(true)

    // Simulate sending comment - in a real app, this would call an API
    setTimeout(() => {
      setComment("")
      setIsLoading(false)
      // In a real app, we would update the comments list here
    }, 1000)
  }

  // Format category name
  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      electrical: "Listrik",
      plumbing: "Pipa/Air",
      furniture: "Furnitur",
      door: "Pintu/Jendela",
      wall: "Dinding/Lantai",
      other: "Lainnya",
    }

    return categories[category] || category
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader user={user} />

      <div className="flex">
        <DashboardSidebar activeItem="report" />

        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Detail Laporan</h1>
              <p className="text-muted-foreground">Laporan #{params.id}</p>
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
                        Dibuat pada{" "}
                        {new Date(report.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
                    <p className="text-sm">{getCategoryName(report.category)}</p>
                  </div>

                  {report.images.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Foto Kerusakan</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {report.images.map((image, index) => (
                          <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`Foto kerusakan ${index + 1}`}
                            className="rounded-md w-full h-auto"
                          />
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
                  {report.comments.map((comment) => (
                    <div key={comment.id} className={`flex gap-4 ${comment.isStaff ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          comment.isStaff ? "bg-muted" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{comment.user}</p>
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
                        {new Date(report.updatedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium">Lokasi</h3>
                      <p className="text-sm mt-1">Kamar {user.room}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informasi Penanganan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {report.status === "pending" && (
                      <p className="text-sm">Laporan Anda sedang menunggu untuk ditinjau oleh tim PART.</p>
                    )}

                    {report.status === "in-progress" && (
                      <>
                        <div>
                          <h3 className="text-sm font-medium">Petugas</h3>
                          <p className="text-sm mt-1">Ahmad Teknisi</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Jadwal Kunjungan</h3>
                          <p className="text-sm mt-1">16 Mei 2023, 10:00 WIB</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Estimasi Selesai</h3>
                          <p className="text-sm mt-1">16 Mei 2023</p>
                        </div>
                      </>
                    )}

                    {report.status === "completed" && (
                      <>
                        <div>
                          <h3 className="text-sm font-medium">Diselesaikan Oleh</h3>
                          <p className="text-sm mt-1">Ahmad Teknisi</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Tanggal Selesai</h3>
                          <p className="text-sm mt-1">
                            {new Date(report.updatedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Catatan Penyelesaian</h3>
                          <p className="text-sm mt-1">
                            Lampu kamar telah diganti dengan yang baru. Fitting juga sudah diperbaiki.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

