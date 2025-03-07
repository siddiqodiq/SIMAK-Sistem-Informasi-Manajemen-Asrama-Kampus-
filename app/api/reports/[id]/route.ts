// app/api/reports/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session) return new Response("Unauthorized", { status: 401 })

    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        images: true, // Pastikan relasi images diambil
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

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error fetching report:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data laporan" },
      { status: 500 }
    )
  }
}