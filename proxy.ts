import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Cac duong dan khong yeu cau dang nhap.
const PUBLIC_PREFIXES = [
  "/dang-nhap",
  "/dang-ky",
  "/quen-mat-khau",
  "/dat-lai-mat-khau",
  "/auth/callback",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// Refresh session token o moi request — bat buoc theo huong dan chinh thuc
// cua @supabase/ssr cho Next.js App Router. Khong lam viec nay se khien
// session het han giua chung ma Server Component khong biet.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const publicPath = isPublicPath(pathname);

  // Chua dang nhap va vao trang can bao ve -> day ve trang dang nhap.
  if (!user && !publicPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dang-nhap";
    redirectUrl.search = "";
    redirectUrl.searchParams.set("next", pathname);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  // Da dang nhap roi ma con vao trang dang nhap/dang ky -> day ve trang chu.
  if (user && publicPath && pathname !== "/auth/callback") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.search = "";
    const redirectResponse = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
