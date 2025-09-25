import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Obtener la IP del cliente desde headers
  const clientIP =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  return NextResponse.json({ ip: clientIP });
}
