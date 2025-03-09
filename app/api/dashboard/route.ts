import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

// app/api/dashboard/route.ts
export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return new Response("Unauthorized", { status: 401 })

    // Jika admin, ambil semua laporan
    if (session.role === "ADMIN") {
      const reports = await prisma.report.findMany({
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
          comments: true,
        },
        orderBy: { createdAt: "desc" },
      })

      return NextResponse.json({
        reports,
        isAdmin: true,
      })
    }

    // Jika user biasa, ambil laporan miliknya saja
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        room: true,
        reports: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            room: true,
            images: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json({
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        room: user?.room,
      },
      reports: user?.reports || [],
      isAdmin: false,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data dashboard" },
      { status: 500 }
    )
  }
}