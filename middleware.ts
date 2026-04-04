import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page: redirect to dashboard if already authenticated
  if (pathname === "/admin/login") {
    const adminKey = request.cookies.get("admin-key")?.value;
    const expectedKey = process.env.ADMIN_API_KEY;

    if (expectedKey && adminKey && decodeURIComponent(adminKey) === expectedKey) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  // All other /admin routes: require authentication
  const adminKey = request.cookies.get("admin-key")?.value;
  const expectedKey = process.env.ADMIN_API_KEY;

  // If no key is configured, allow access
  if (!expectedKey) {
    return NextResponse.next();
  }

  // No cookie or invalid key → redirect to login
  if (!adminKey || decodeURIComponent(adminKey) !== expectedKey) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
