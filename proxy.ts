import { auth } from "./auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const isLogged = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")
  
  if (isAuthPage) {
    if (isLogged) {
      return NextResponse.redirect(new URL("/", req.url))
    }
    return NextResponse.next()
  }

  // Allow unprotected access to public landing page if needed
  if (!isLogged && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})


// Specify paths for Proxy to run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
