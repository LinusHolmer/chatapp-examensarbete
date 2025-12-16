import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const jwt = request.cookies.get("jwt")?.value;
  if (!jwt) return NextResponse.json({ message: "Missing jwt cookie" }, { status: 401 });

  const body = await request.json(); 

  const response = await fetch("http://localhost:8080/messages/sendNew", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (response.status === 201) {
    return new NextResponse(null, { status: 201 });
  }

  const text = await response.text();
  return new NextResponse(text, { status: response.status });
}
