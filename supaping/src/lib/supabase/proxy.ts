
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ONLY_ROUTES = ["/", "/login", "/signup"];
const AUTH_CALLBACK_PREFIX = "/auth";

function isExactRoute(pathname: string, routes: string[]) {
  return routes.includes(pathname);
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Verify the access token and refresh the session if needed.
  const { data, error } = await supabase.auth.getClaims();

  const isAuthenticated = !error && data?.claims != null;
  const { pathname } = request.nextUrl;

  // Allow OAuth callbacks and other auth endpoints to complete.
  if (pathname.startsWith(AUTH_CALLBACK_PREFIX)) {
    return supabaseResponse;
  }

  const isPublicOnlyRoute = isExactRoute(
    pathname,
    PUBLIC_ONLY_ROUTES
  );

  // Authenticated users should not see the landing, login or signup pages.
  if (isAuthenticated && isPublicOnlyRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  // Unauthenticated users may only access the public-only routes.
  if (!isAuthenticated && !isPublicOnlyRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}