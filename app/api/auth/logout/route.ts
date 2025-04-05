import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(
    new URL("/auth/login", process.env.NEXT_PUBLIC_API_URL)
  );

  response.headers.set(
    "Set-Cookie",
    "auth_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;"
  );

  return response;
}
