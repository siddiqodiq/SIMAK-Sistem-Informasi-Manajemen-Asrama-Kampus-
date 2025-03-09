import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) return new Response("Unauthorized", { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        room: true,
        reports: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            room: true, // Sertakan informasi kamar
            images: true,
            comments: {
              orderBy: { createdAt: "asc" },
              take: 1,
            },
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
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data dashboard" },
      { status: 500 }
    )
  }
}