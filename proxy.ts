import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req
    
    const isAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup")
    const isAdminPage = nextUrl.pathname.startsWith("/admin")

    if (isAdminPage && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl))
    }

    if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", nextUrl))
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
