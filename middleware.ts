import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/login" || path === "/register" || path.startsWith("/api/auth")

  // Get the token from the cookies
  const token = request.cookies.get("auth-token")?.value

  // If the path is public and the user is authenticated, redirect to dashboard
  if (isPublicPath && token) {
    try {
      // Verify the token
      verify(token, process.env.JWT_SECRET || "secret")

      // If token is valid and path is public, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch (error) {
      // If token verification fails, continue to the public path
      return NextResponse.next()
    }
  }

  // If the path is not public and the user is not authenticated, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the path is admin and the user is not an admin, redirect to dashboard
  if (path.startsWith("/dashboard/admin")) {
    try {
      const decoded = verify(token || "", process.env.JWT_SECRET || "secret") as {
        role: string
      }

      if (decoded.role !== "ADMIN" && decoded.role !== "STAFF") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*", "/api/:path*"],
}

