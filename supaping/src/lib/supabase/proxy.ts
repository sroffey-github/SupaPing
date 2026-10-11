
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ONLY_ROUTES = ["/", "/login", "/signup"];
const AUTH_CALLBACK_PREFIX = "/auth";

function isExactRoute(pathname: string, routes: string[]) {
  return routes.includes(pathname);
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  // Let the OAuth callback exchange its code and establish the session.
  if (pathname.startsWith(AUTH_CALLBACK_PREFIX)) {
    return supabaseResponse;
  }

  const { data, error } = await supabase.auth.getClaims();
  const isAuthenticated = !error && data?.claims != null;

  const isPublicOnlyRoute = isExactRoute(
    pathname,
    PUBLIC_ONLY_ROUTES
  );

  if (isAuthenticated && isPublicOnlyRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  if (!isAuthenticated && !isPublicOnlyRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
