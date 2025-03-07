"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageCircle, CheckCircle, Clock } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
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

export default function AdminReportDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [comment, setComment] = useState("")
  const [status, setStatus] = useState("pending")
  const [assignedTo, setAssignedTo] = useState("")
  const [completionNotes, setCompletionNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Mock report data
  const report = {
    id: Number.parseInt(params.id),
    title: "Kerusakan Lampu Kamar",
    description:
      "Lampu kamar mati dan perlu diganti. Sudah dicoba untuk mengganti bohlam namun tetap tidak menyala. Sepertinya ada masalah pada fitting atau kabel listriknya.",
    status: "pending",
    category: "electrical",
    createdAt: "2023-05-15T10:30:00",
    updatedAt: "2023-05-15T10:30:00",
    user: "Budi Santoso",
    room: "A-101",
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
    ],
  }

  // Mock admin user data
  const user = {
    name: "Admin PART",
    email: "admin@example.com",
    role: "admin",
  }

  // Mock staff data
  const staffMembers = [
    { id: 1, name: "Ahmad Teknisi" },
    { id: 2, name: "Budi Teknisi" },
    { id: 3, name: "Citra Teknisi" },
    { id: 4, name: "Dodi Teknisi" },
  ]

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

  const handleStatusUpdate = () => {
    setIsLoading(true)

    // Simulate updating status - in a real app, this would call an API
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, we would update the report status here
      router.push("/dashboard/admin")
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
        <DashboardSidebar activeItem="admin" />

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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Kategori</h3>
                      <p className="text-sm">{getCategoryName(report.category)}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Pelapor</h3>
                      <p className="text-sm">
                        {report.user} (Kamar {report.room})
                      </p>
                    </div>
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
                  <CardDescription>Komunikasi dengan penghuni asrama mengenai laporan ini</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {report.comments.map((comment) => (
                    <div key={comment.id} className={`flex gap-4 ${comment.isStaff ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          comment.isStaff ? "bg-primary text-primary-foreground" : "bg-muted"
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
                        placeholder="Tulis pesan untuk penghuni..."
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
                  <CardTitle>Pengelolaan Laporan</CardTitle>
                  <CardDescription>Perbarui status dan tetapkan petugas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status Laporan</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Menunggu</SelectItem>
                        <SelectItem value="in-progress">Diproses</SelectItem>
                        <SelectItem value="completed">Selesai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Tetapkan Petugas</Label>
                    <Select value={assignedTo} onValueChange={setAssignedTo}>
                      <SelectTrigger id="assignedTo">
                        <SelectValue placeholder="Pilih petugas" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffMembers.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id.toString()}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {status === "completed" && (
                    <div className="space-y-2">
                      <Label htmlFor="completionNotes">Catatan Penyelesaian</Label>
                      <Textarea
                        id="completionNotes"
                        placeholder="Berikan catatan tentang penyelesaian laporan..."
                        value={completionNotes}
                        onChange={(e) => setCompletionNotes(e.target.value)}
                        rows={4}
                      />
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={handleStatusUpdate}
                    disabled={
                      isLoading ||
                      (status === "in-progress" && !assignedTo) ||
                      (status === "completed" && !completionNotes)
                    }
                  >
                    {isLoading ? (
                      "Memproses..."
                    ) : status === "pending" ? (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        Tandai Sedang Diproses
                      </>
                    ) : status === "in-progress" ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Tandai Selesai
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Aktivitas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Laporan Dibuat</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(report.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Komentar Ditambahkan</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(report.comments[0].createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Komentar Ditambahkan</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(report.comments[1].createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
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

