"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"

export default function ProfilePage() {
  const [roomNumber, setRoomNumber] = useState("")
  const [building, setBuilding] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/user/update-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomNumber, building }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal memperbarui nomor kamar")
      }

      toast({
        title: "Berhasil",
        description: "Nomor kamar berhasil diperbarui",
      })
    } catch (error) {
      console.error("Error updating room:", error)
      toast({
        title: "Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader user={{ name: "User", email: "user@example.com" }} />

      <div className="flex">
        <DashboardSidebar activeItem="profile" />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Profil</h1>
            <p className="text-muted-foreground">Kelola informasi akun Anda</p>
          </div>

          <div className="max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Update Nomor Kamar</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="building">Gedung</Label>
                <Select onValueChange={setBuilding} value={building}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih gedung" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Gedung A</SelectItem>
                    <SelectItem value="B">Gedung B</SelectItem>
                    <SelectItem value="C">Gedung C</SelectItem>
                    <SelectItem value="D">Gedung D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomNumber">Nomor Kamar</Label>
                <Input
                  id="roomNumber"
                  placeholder="Contoh: 101"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Perbarui Nomor Kamar"}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}