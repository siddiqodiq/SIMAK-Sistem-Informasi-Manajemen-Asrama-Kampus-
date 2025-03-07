import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { room: true },
    })

    const reports = await prisma.report.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 5, // Limit to 5 most recent reports
    })

    return NextResponse.json({ user, reports })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data dashboard" }, { status: 500 })
  }
}

