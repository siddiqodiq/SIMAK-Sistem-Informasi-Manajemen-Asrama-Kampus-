import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const roomNumber = searchParams.get("roomNumber")
  const building = searchParams.get("building")

  if (!roomNumber || !building) {
    return NextResponse.json(
      { error: "Nomor kamar dan gedung wajib diisi" },
      { status: 400 }
    )
  }

  try {
    const reports = await prisma.report.findMany({
      where: {
        reportedRoomNumber: roomNumber,
        reportedBuilding: building,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error fetching report history:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil riwayat laporan" },
      { status: 500 }
    )
  }
}