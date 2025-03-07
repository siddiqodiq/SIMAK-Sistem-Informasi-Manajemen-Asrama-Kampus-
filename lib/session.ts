import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"

export async function getServerSession() {
  const token = cookies().get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const verified = verify(token, process.env.JWT_SECRET || "secret")
    return verified as {
      id: string
      email: string
      role: "USER" | "ADMIN" | "STAFF"
    }
  } catch (error) {
    console.error("Session verification error:", error)
    return null
  }
}

