"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, CheckCircle2, Clock, AlertCircle, PlusCircle } from "lucide-react"
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

// Mock data for reports
const mockReports = [
  {
    id: 1,
    title: "Kerusakan Lampu Kamar",
    description: "Lampu kamar mati dan perlu diganti",
    status: "pending",
    createdAt: "2023-05-15T10:30:00",
    updatedAt: "2023-05-15T10:30:00",
    user: "Budi Santoso",
    room: "A-101",
    category: "electrical",
  },
  {
    id: 2,
    title: "Kebocoran Pipa Wastafel",
    description: "Ada kebocoran pada pipa di bawah wastafel kamar mandi",
    status: "in-progress",
    createdAt: "2023-05-10T14:20:00",
    updatedAt: "2023-05-11T09:15:00",
    user: "Dewi Lestari",
    room: "B-205",
    category: "plumbing",
  },
  {
    id: 3,
    title: "Kunci Pintu Rusak",
    description: "Kunci pintu kamar sulit diputar dan terkadang macet",
    status: "completed",
    createdAt: "2023-05-05T08:45:00",
    updatedAt: "2023-05-07T13:20:00",
    user: "Ahmad Rizki",
    room: "C-310",
    category: "door",
  },
  {
    id: 4,
    title: "Kursi Patah",
    description: "Salah satu kaki kursi patah",
    status: "pending",
    createdAt: "2023-05-14T16:30:00",
    updatedAt: "2023-05-14T16:30:00",
    user: "Siti Aminah",
    room: "A-203",
    category: "furniture",
  },
  {
    id: 5,
    title: "AC Tidak Dingin",
    description: "AC kamar tidak mengeluarkan udara dingin",
    status: "in-progress",
    createdAt: "2023-05-12T11:15:00",
    updatedAt: "2023-05-13T10:20:00",
    user: "Rudi Hartono",
    room: "D-405",
    category: "electrical",
  },
]

// Mock data for shared inventory reports
const mockInventoryReports = [
  {
    id: 1,
    title: "Kerusakan Meja Ruang Belajar",
    description: "Meja di ruang belajar patah",
    status: "pending",
    createdAt: "2023-05-15T10:30:00",
    updatedAt: "2023-05-15T10:30:00",
    user: "Admin Asrama",
    location: "Ruang Belajar",
    category: "furniture",
  },
  {
    id: 2,
    title: "Kebocoran Pipa Dapur",
    description: "Ada kebocoran pada pipa di dapur umum",
    status: "in-progress",
    createdAt: "2023-05-10T14:20:00",
    updatedAt: "2023-05-11T09:15:00",
    user: "Admin Asrama",
    location: "Dapur Umum",
    category: "plumbing",
  },
  // ...additional mock data...
]

export default function BiroDashboardPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Mock user data for Biro role
  const user = {
    name: "Biro Asrama",
    email: "biro@example.com",
    role: "biro",
  }

  // Filter reports based on search query and filters
  const filteredReports = mockReports.filter((report) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.room.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    // Filter by category
    const matchesCategory = categoryFilter === "all" || report.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Filter inventory reports based on search query and filters
  const filteredInventoryReports = mockInventoryReports.filter((report) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Count reports by status
  const pendingCount = mockReports.filter((report) => report.status === "pending").length
  const inProgressCount = mockReports.filter((report) => report.status === "in-progress").length
  const completedCount = mockReports.filter((report) => report.status === "completed").length

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader user={user} />

      <div className="flex">
        <DashboardSidebar activeItem="biro-asrama" />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Dashboard Biro Asrama</h1>
            <p className="text-muted-foreground">Kelola laporan kerusakan kamar asrama dan inventaris bersama</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Laporan yang belum ditangani</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Diproses</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressCount}</div>
                <p className="text-xs text-muted-foreground">Laporan yang sedang ditangani</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Selesai</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCount}</div>
                <p className="text-xs text-muted-foreground">Laporan yang telah diselesaikan</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="room-reports" className="space-y-4">
            <TabsList>
              <TabsTrigger value="room-reports">Laporan Kerusakan Kamar</TabsTrigger>
              <TabsTrigger value="inventory-reports">Laporan Kerusakan Inventaris</TabsTrigger>
            </TabsList>

            <TabsContent value="room-reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Daftar Laporan Kerusakan Kamar</CardTitle>
                  <CardDescription>Kelola dan tindaklanjuti laporan kerusakan dari penghuni asrama</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari laporan..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Filter:</span>
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="pending">Menunggu</SelectItem>
                          <SelectItem value="in-progress">Diproses</SelectItem>
                          <SelectItem value="completed">Selesai</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Kategori</SelectItem>
                          <SelectItem value="electrical">Listrik</SelectItem>
                          <SelectItem value="plumbing">Pipa/Air</SelectItem>
                          <SelectItem value="furniture">Furnitur</SelectItem>
                          <SelectItem value="door">Pintu/Jendela</SelectItem>
                          <SelectItem value="wall">Dinding/Lantai</SelectItem>
                          <SelectItem value="other">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="all">Semua</TabsTrigger>
                      <TabsTrigger value="pending">Menunggu</TabsTrigger>
                      <TabsTrigger value="in-progress">Diproses</TabsTrigger>
                      <TabsTrigger value="completed">Selesai</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                      {filteredReports.length > 0 ? (
                        <div className="rounded-md border">
                          <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted/50">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-3">Judul</div>
                            <div className="col-span-2">Penghuni</div>
                            <div className="col-span-1">Kamar</div>
                            <div className="col-span-2">Tanggal</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-1">Aksi</div>
                          </div>
                          {filteredReports.map((report) => (
                            <div
                              key={report.id}
                              className="grid grid-cols-12 gap-2 p-4 border-b last:border-0 items-center"
                            >
                              <div className="col-span-1 font-medium">#{report.id}</div>
                              <div className="col-span-3 font-medium">{report.title}</div>
                              <div className="col-span-2">{report.user}</div>
                              <div className="col-span-1">{report.room}</div>
                              <div className="col-span-2 text-sm">
                                {new Date(report.createdAt).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="col-span-2">
                                <StatusBadge status={report.status} />
                              </div>
                              <div className="col-span-1">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/dashboard/biro/report/${report.id}`}>Detail</Link>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Tidak ada laporan yang ditemukan</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-4">
                      {filteredReports.filter((r) => r.status === "pending").length > 0 ? (
                        <div className="rounded-md border">
                          <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted/50">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-3">Judul</div>
                            <div className="col-span-2">Penghuni</div>
                            <div className="col-span-1">Kamar</div>
                            <div className="col-span-2">Tanggal</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-1">Aksi</div>
                          </div>
                          {filteredReports
                            .filter((r) => r.status === "pending")
                            .map((report) => (
                              <div
                                key={report.id}
                                className="grid grid-cols-12 gap-2 p-4 border-b last:border-0 items-center"
                              >
                                <div className="col-span-1 font-medium">#{report.id}</div>
                                <div className="col-span-3 font-medium">{report.title}</div>
                                <div className="col-span-2">{report.user}</div>
                                <div className="col-span-1">{report.room}</div>
                                <div className="col-span-2 text-sm">
                                  {new Date(report.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                                <div className="col-span-2">
                                  <StatusBadge status={report.status} />
                                </div>
                                <div className="col-span-1">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/dashboard/biro/report/${report.id}`}>Detail</Link>
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Tidak ada laporan yang menunggu</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="in-progress" className="space-y-4">
                      {filteredReports.filter((r) => r.status === "in-progress").length > 0 ? (
                        <div className="rounded-md border">
                          <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted/50">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-3">Judul</div>
                            <div className="col-span-2">Penghuni</div>
                            <div className="col-span-1">Kamar</div>
                            <div className="col-span-2">Tanggal</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-1">Aksi</div>
                          </div>
                          {filteredReports
                            .filter((r) => r.status === "in-progress")
                            .map((report) => (
                              <div
                                key={report.id}
                                className="grid grid-cols-12 gap-2 p-4 border-b last:border-0 items-center"
                              >
                                <div className="col-span-1 font-medium">#{report.id}</div>
                                <div className="col-span-3 font-medium">{report.title}</div>
                                <div className="col-span-2">{report.user}</div>
                                <div className="col-span-1">{report.room}</div>
                                <div className="col-span-2 text-sm">
                                  {new Date(report.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                                <div className="col-span-2">
                                  <StatusBadge status={report.status} />
                                </div>
                                <div className="col-span-1">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/dashboard/biro/report/${report.id}`}>Detail</Link>
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Tidak ada laporan yang sedang diproses</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-4">
                      {filteredReports.filter((r) => r.status === "completed").length > 0 ? (
                        <div className="rounded-md border">
                          <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted/50">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-3">Judul</div>
                            <div className="col-span-2">Penghuni</div>
                            <div className="col-span-1">Kamar</div>
                            <div className="col-span-2">Tanggal</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-1">Aksi</div>
                          </div>
                          {filteredReports
                            .filter((r) => r.status === "completed")
                            .map((report) => (
                              <div
                                key={report.id}
                                className="grid grid-cols-12 gap-2 p-4 border-b last:border-0 items-center"
                              >
                                <div className="col-span-1 font-medium">#{report.id}</div>
                                <div className="col-span-3 font-medium">{report.title}</div>
                                <div className="col-span-2">{report.user}</div>
                                <div className="col-span-1">{report.room}</div>
                                <div className="col-span-2 text-sm">
                                  {new Date(report.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                                <div className="col-span-2">
                                  <StatusBadge status={report.status} />
                                </div>
                                <div className="col-span-1">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/dashboard/biro/report/${report.id}`}>Detail</Link>
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Tidak ada laporan yang telah selesai</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory-reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Daftar Laporan Kerusakan Inventaris</CardTitle>
                  <CardDescription>Kelola dan tindaklanjuti laporan kerusakan inventaris bersama</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari laporan..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Filter:</span>
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="pending">Menunggu</SelectItem>
                          <SelectItem value="in-progress">Diproses</SelectItem>
                          <SelectItem value="completed">Selesai</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Kategori</SelectItem>
                          <SelectItem value="electrical">Listrik</SelectItem>
                          <SelectItem value="plumbing">Pipa/Air</SelectItem>
                          <SelectItem value="furniture">Furnitur</SelectItem>
                          <SelectItem value="door">Pintu/Jendela</SelectItem>
                          <SelectItem value="wall">Dinding/Lantai</SelectItem>
                          <SelectItem value="other">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted/50">
                      <div className="col-span-1">ID</div>
                      <div className="col-span-3">Judul</div>
                      <div className="col-span-2">Penghuni</div>
                      <div className="col-span-2">Lokasi</div>
                      <div className="col-span-2">Tanggal</div>
                      <div className="col-span-2">Status</div>
                    </div>
                    {filteredInventoryReports.map((report) => (
                      <div
                        key={report.id}
                        className="grid grid-cols-12 gap-2 p-4 border-b last:border-0 items-center"
                      >
                        <div className="col-span-1 font-medium">#{report.id}</div>
                        <div className="col-span-3 font-medium">{report.title}</div>
                        <div className="col-span-2">{report.user}</div>
                        <div className="col-span-2">{report.location}</div>
                        <div className="col-span-2 text-sm">
                          {new Date(report.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="col-span-2">
                          <StatusBadge status={report.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-6">
            <Button asChild>
              <Link href="/dashboard/biro/inventory/report">
                <PlusCircle className="mr-2 h-4 w-4" />
                Laporkan Kerusakan Inventaris Bersama
              </Link>
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}

