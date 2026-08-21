import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (err) {
    console.warn("Root middleware skipped on error:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image  (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - /media/* (public media assets)
     * - /api/member/* (public registration APIs)
     * - /api/geo/*   (public geography APIs)
     * - /api/cms/*   (public CMS APIs)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|media/|api/member/|api/geo/|api/cms/).*)",
  ],
};
