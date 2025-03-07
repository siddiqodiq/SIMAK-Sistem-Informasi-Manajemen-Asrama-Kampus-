import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        room: true,
        images: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    })

    if (!report) {
      return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 })
    }

    // Check if user has access to this report
    if (session.role !== "ADMIN" && session.role !== "STAFF" && report.userId !== session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error fetching report:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data laporan" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admin and staff can update reports
    if (session.role !== "ADMIN" && session.role !== "STAFF") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { status, assignedTo, completionNotes } = body

    // Validate input
    if (!status) {
      return NextResponse.json({ error: "Status wajib diisi" }, { status: 400 })
    }

    // Check if report exists
    const report = await prisma.report.findUnique({
      where: { id: params.id },
    })

    if (!report) {
      return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 })
    }

    // Update report
    const updateData: any = { status }

    if (assignedTo) {
      updateData.assignedTo = assignedTo
    }

    if (status === "COMPLETED") {
      updateData.completedAt = new Date()

      if (completionNotes) {
        updateData.completionNotes = completionNotes
      }
    }

    const updatedReport = await prisma.report.update({
      where: { id: params.id },
      data: updateData,
    })

    // Add system comment about status change
    let statusMessage = ""
    if (status === "IN_PROGRESS") {
      statusMessage = "Laporan sedang diproses oleh tim PART."
    } else if (status === "COMPLETED") {
      statusMessage = "Laporan telah diselesaikan oleh tim PART."
    }

    if (statusMessage) {
      await prisma.comment.create({
        data: {
          message: statusMessage,
          reportId: params.id,
          userId: session.id,
        },
      })
    }

    return NextResponse.json(updatedReport)
  } catch (error) {
    console.error("Error updating report:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memperbarui laporan" }, { status: 500 })
  }
}

