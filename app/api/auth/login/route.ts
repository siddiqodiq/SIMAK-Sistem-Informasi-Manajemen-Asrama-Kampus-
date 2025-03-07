import { NextResponse } from "next/server"
import { verifyUser } from "@/lib/auth"
import { cookies } from "next/headers"
import { sign } from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 })
    }

    // Verify user
    const user = await verifyUser(email, password)

    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 })
    }

    // Create JWT token
    const token = sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" },
    )

    // Set cookie
    cookies().set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        room: user.room,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat login" }, { status: 500 })
  }
}

