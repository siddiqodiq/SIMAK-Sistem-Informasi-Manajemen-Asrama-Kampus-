import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-primary-foreground">SIMAK</h1>
          <p className="text-primary-foreground/80">Sistem Informasi Manajemen Asrama Kampus</p>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Manajemen Inventaris Keasramaan</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Platform untuk melaporkan kerusakan kamar pribadi dan mengelola inventaris asrama dengan mudah dan
              efisien.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/login">Masuk</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Fitur Utama</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">Pelaporan Kerusakan</h3>
              <p className="mb-4">Laporkan kerusakan kamar pribadi dengan mudah dan pantau status penanganannya.</p>
              <Link href="/login" className="text-primary inline-flex items-center">
                Mulai Laporkan <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">Pengelolaan oleh PART</h3>
              <p className="mb-4">
                Tim PART mengelola dan menindaklanjuti laporan kerusakan dengan sistem yang terintegrasi.
              </p>
              <Link href="/login" className="text-primary inline-flex items-center">
                Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">Pelacakan Status</h3>
              <p className="mb-4">Pantau status penanganan laporan kerusakan secara real-time.</p>
              <Link href="/login" className="text-primary inline-flex items-center">
                Cek Status <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Sistem Manajemen Inventaris Keasramaan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

