"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"

export default function ReportPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    images: [] as File[],
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
  
      // Buat URL preview untuk gambar
      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file));
  
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArray],
      }));
  
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index])

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))

    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    try {
      // Validasi input
      if (!formData.title || !formData.category || !formData.description) {
        setError("Semua field wajib diisi");
        setIsLoading(false);
        return;
      }
  
      // Buat FormData untuk mengirim file
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("description", formData.description);
  
      // Tambahkan file gambar jika ada
      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });
  
      // Kirim data ke API
      const response = await fetch("/api/reports", {
        method: "POST",
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengirim laporan");
      }
  
      // Redirect ke dashboard setelah berhasil
      router.push("/dashboard");
    } catch (err) {
      console.error("Error submitting report:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim laporan");
    } finally {
      setIsLoading(false);
    }
  };

  // Mock user data
  const user = {
    name: "Budi Santoso",
    email: "budi@example.com",
    room: "A-101",
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
              <h1 className="text-3xl font-bold">Buat Laporan Kerusakan</h1>
              <p className="text-muted-foreground">Laporkan kerusakan kamar pribadi Anda</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Form Laporan Kerusakan</CardTitle>
              <CardDescription>
                Isi detail kerusakan yang terjadi di kamar Anda untuk ditindaklanjuti oleh PART
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Laporan</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Contoh: Kerusakan Lampu Kamar"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategori Kerusakan</Label>
                  <Select onValueChange={handleCategoryChange} value={formData.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori kerusakan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electrical">Listrik</SelectItem>
                      <SelectItem value="plumbing">Pipa/Air</SelectItem>
                      <SelectItem value="furniture">Furnitur</SelectItem>
                      <SelectItem value="door">Pintu/Jendela</SelectItem>
                      <SelectItem value="wall">Dinding/Lantai</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Kerusakan</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Jelaskan detail kerusakan yang terjadi..."
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Foto Kerusakan (Opsional)</Label>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="images"
                      className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Pilih Foto
                    </Label>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {previewUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full rounded-md object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                            onClick={() => removeImage(index)}
                          >
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Batal
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Mengirim..." : "Kirim Laporan"}
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  )
}

