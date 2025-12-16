import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const jwt = request.cookies.get("jwt")?.value;
  if (!jwt) return NextResponse.json({ message: "Missing jwt cookie" }, { status: 401 });

  const response = await fetch("http://localhost:8080/messages/viewSentMessages", {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
