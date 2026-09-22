import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { locales, defaultLocale } from "@/i18n/config";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);
const cookieName = process.env.AUTH_COOKIE_NAME || "sgbc_admin_session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---- Exclude admin, api, and static files from locale redirection ----
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    // Check admin authentication specifically for non-login admin routes
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      const token = req.cookies.get(cookieName)?.value;
      if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));
      try {
        await jwtVerify(token, secret);
      } catch {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    return NextResponse.next();
  }

  // ---- Locale redirect for public/marketing routes ----
  const first = pathname.split("/")[1];
  const hasLocale = (locales as readonly string[]).includes(first);

  if (!hasLocale) {
    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};