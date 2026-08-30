import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Guard administrative pages (/admin/dashboard)
  if (pathname.startsWith("/admin/dashboard")) {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guard administrative APIs (/api/admin/* except /api/admin/login/*)
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login")) {
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json(
        { error: "Unauthorized administrative access. Valid 2FA session required." },
        { status: 401 }
      );
    }
  }

  const response = NextResponse.next();

  // Set essential security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets, media, and images
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|media/).*)",
  ],
};
