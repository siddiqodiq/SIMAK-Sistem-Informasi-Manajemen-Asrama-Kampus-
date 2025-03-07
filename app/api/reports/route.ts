import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const images = formData.getAll("images") as File[]

    // Validate input
    if (!title || !description || !category) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 })
    }

    // Get user's room
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { room: true },
    })

    if (!user?.room) {
      return NextResponse.json({ error: "User tidak memiliki kamar" }, { status: 400 })
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        title,
        description,
        category,
        status: "PENDING",
        userId: session.id,
        roomId: user.room.id,
      },
    })

    // Upload and save images
    if (images.length > 0) {
      // In a real app, you would upload these to a storage service like S3
      // For this example, we'll just save the file names
      const imagePromises = images.map(async (image) => {
        const fileName = `${Date.now()}-${image.name}`

        // Here you would upload the file to your storage service
        // const uploadResult = await uploadToStorage(image, fileName)

        // For now, we'll just save a placeholder URL
        return prisma.image.create({
          data: {
            url: `/uploads/${fileName}`,
            reportId: report.id,
          },
        })
      })

      await Promise.all(imagePromises)
    }

    // Add initial comment from system
    await prisma.comment.create({
      data: {
        message: "Laporan Anda telah diterima dan sedang menunggu untuk ditinjau oleh tim PART.",
        reportId: report.id,
        userId: session.id, // In a real app, you might have a system user for this
      },
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat membuat laporan" }, { status: 500 })
  }
}

