import { NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, confirmPassword, roomNumber, building } = body

    // Validate input
    if (!name || !email || !password || !confirmPassword || !roomNumber || !building) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Password tidak cocok" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    // Get or create room
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

    // Create user
    const user = await createUser({
      name,
      email,
      password,
      roomId: room.id,
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat mendaftar" }, { status: 500 })
  }
}

