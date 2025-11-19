import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    console.log("Proxy for:" , request.nextUrl.pathname)
    return NextResponse.redirect(new URL('/login', request.url))
}
export const config = {
    matcher: "/test/:path*",
}