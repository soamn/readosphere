import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  const ua = req.headers.get("user-agent") || "";

  if (ua.includes("Mozilla") && req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.rewrite(new URL("/", req.url));
  }

  const authToken = req.cookies.get("auth_token")?.value;

  if (!authToken) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }
}
export const config = {
  matcher: "/admin/:path*",
};
