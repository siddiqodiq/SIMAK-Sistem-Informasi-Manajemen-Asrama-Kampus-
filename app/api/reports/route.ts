import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) return new Response("Unauthorized", { status: 401 })

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const reportedRoomNumber = formData.get("reportedRoomNumber") as string
    const reportedBuilding = formData.get("reportedBuilding") as string

    // Validasi input
    if (!title || !description || !category || !reportedRoomNumber || !reportedBuilding) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      )
    }

    // Fetch the user and their associated room
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { room: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Buat laporan baru
    const report = await prisma.report.create({
      data: {
        title,
        description,
        category,
        status: "PENDING",
        userId: session.id,
        roomId: user.room?.id || null, // Kamar saat ini (null jika tidak ada)
        reportedRoomNumber, // Nomor kamar yang dilaporkan
        reportedBuilding,   // Gedung yang dilaporkan
      },
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat laporan" },
      { status: 500 }
    )
  }
}