import { NextResponse, NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  
  const jwt = request.cookies.get("jwt")?.value

  if(!jwt) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // console.log("COOKIE HEADER:", request.headers.get("cookie"))

  const response = await fetch("http://localhost:8080/auth", {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}`},
    cache: 'no-store'
    
  })
  
  // console.log("BACKEND RESPONSE:", response.status)

  if(!response.ok) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const data = await response.json();


  console.log(data)

  if(request.nextUrl.pathname.startsWith("/") && !data == (true)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()

}
export const config = {
  matcher: ["/"],
};