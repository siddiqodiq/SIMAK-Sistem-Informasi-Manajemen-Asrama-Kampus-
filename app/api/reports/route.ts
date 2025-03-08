import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) return new Response("Unauthorized", { status: 401 })

    const formData = await request.formData()

    // Validasi input
    const requiredFields = ['title', 'description', 'category']
    const missingFields = requiredFields.filter(field => !formData.get(field))
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Field yang wajib diisi: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Dapatkan user dengan room
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { room: true },
    })

    if (!user?.room) {
      return NextResponse.json(
        { error: "User tidak memiliki kamar yang valid" },
        { status: 400 }
      )
    }

    // Buat report
    const report = await prisma.report.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        status: "PENDING",
        userId: session.id,
        roomId: user.room.id,
      },
    })

    // Handle image upload
    const images = formData.getAll("images") as File[]
    if (images.length > 0) {
      await Promise.all(
        images.map(async (image, index) => {
          const buffer = await image.arrayBuffer()
          const fileName = `${Date.now()}-${image.name}-${report.id}` // Tambahkan ID laporan ke nama file
          const filePath = join(process.cwd(), "public", "uploads", fileName)

          // Simpan file ke folder uploads
          await writeFile(filePath, Buffer.from(buffer))

          // Simpan URL gambar ke database
          return prisma.image.create({
            data: {
              url: `/uploads/${fileName}`,
              reportId: report.id,
            },
          })
        })
      )
    }

    /*// Buat komentar awal
    await prisma.comment.create({
      data: {
        message: "Laporan Anda telah diterima dan sedang menunggu untuk ditinjau oleh tim PART.",
        reportId: report.id,
        userId: session.id,
      },
    })*/

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat laporan" },
      { status: 500 }
    )
  }
}