import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { message } = body

    // Validate input
    if (!message) {
      return NextResponse.json({ error: "Pesan wajib diisi" }, { status: 400 })
    }

    // Check if report exists
    const report = await prisma.report.findUnique({
      where: { id: params.id },
    })

    if (!report) {
      return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 })
    }

    // Check if user has access to this report
    if (session.role !== "ADMIN" && session.role !== "STAFF" && report.userId !== session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        message,
        reportId: params.id,
        userId: session.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat membuat komentar" }, { status: 500 })
  }
}

