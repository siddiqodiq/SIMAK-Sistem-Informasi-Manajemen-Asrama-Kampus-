import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) return new Response("Unauthorized", { status: 401 })

    const body = await request.json()
    const { roomNumber, building } = body

    // Validasi input
    if (!roomNumber || !building) {
      return NextResponse.json(
        { error: "Nomor kamar dan gedung wajib diisi" },
        { status: 400 }
      )
    }

    // Cari atau buat kamar baru
    const floor = roomNumber.charAt(0)
    let room = await prisma.room.findFirst({
      where: {
        number: roomNumber,
        building: building,
      },
    })

    if (!room) {
      room = await prisma.room.create({
        data: {
          number: roomNumber,
          building: building,
          floor: floor,
        },
      })
    }

    // Update nomor kamar pengguna
    const updatedUser = await prisma.user.update({
      where: { id: session.id },
      data: {
        roomId: room.id,
      },
      include: {
        room: true,
      },
    })

    return NextResponse.json({
      message: "Nomor kamar berhasil diperbarui",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating room:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui nomor kamar" },
      { status: 500 }
    )
  }
}