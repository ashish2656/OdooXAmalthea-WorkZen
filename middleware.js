import { NextResponse } from "next/server"

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Allow login page without auth
  if (pathname === "/") {
    return NextResponse.next()
  }

  // Check for user in cookies/session
  const user = request.cookies.get("user")?.value

  // Redirect to login if not authenticated
  if (!user && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
