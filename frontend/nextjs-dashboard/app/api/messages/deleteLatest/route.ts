import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const jwt = request.cookies.get("jwt")?.value;
  if (!jwt) {
    return NextResponse.json({ message: "Missing jwt cookie" }, { status: 401 });
  }

  const body = await request.json();

  const response = await fetch("http://localhost:8080/messages/deleteLatest", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await response.text();
  return new NextResponse(text, { status: response.status });
}
