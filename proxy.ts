import { auth } from "./auth"
import { NextResponse } from "next/server"
import { roles } from "@/lib/auth/roles"
import { Actions, defineAbilitiesFor, permissions, Subjects } from "@/lib/casl/ability"

type RouteGuard = {
  pattern: string
  action: Actions
  subject: Subjects
}

// Add a row here for each route that requires a specific ability.
const PROTECTED_ROUTES: RouteGuard[] = [
  { pattern: "/story", action: permissions.story.creator.action, subject: permissions.story.creator.subject },
  { pattern: "/admin", action: permissions.admin.panel.action, subject: permissions.admin.panel.subject },
]

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl
  const storyId = req.nextUrl.searchParams.get("storyId")
  const isLogged = !!req.auth
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isStoryReadRoute = pathname === "/story" && Boolean(storyId)

  if (isAuthPage) {
    if (isLogged) {
      return NextResponse.redirect(new URL("/", req.url))
    }
    return NextResponse.next()
  }

  const isPublicRoute = pathname === "/" || pathname === "/stories" || isStoryReadRoute

  if (!isLogged && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const role = req.auth?.user?.role ?? roles.user
  const ability = defineAbilitiesFor(role)

  for (const guard of PROTECTED_ROUTES) {
    if (guard.pattern === "/story" && isStoryReadRoute) {
      continue
    }

    if (pathname.startsWith(guard.pattern) && ability.cannot(guard.action, guard.subject)) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
