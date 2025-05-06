import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("sb-access-token")?.value;

  const protectedPaths = ["/dashboard", "/finanzas", "/secretaria"];
  const url = request.nextUrl.pathname;

  if (protectedPaths.some((path) => url.startsWith(path)) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
