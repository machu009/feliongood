import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const isAdminLogin = path.startsWith("/admin/login");
  const isAdminPath = path.startsWith("/admin") && !isAdminLogin;

  const isTeamLogin = path.startsWith("/team/login");
  const isTeamPath = path.startsWith("/team") && !isTeamLogin;

  // Not logged in, trying to reach a protected area -> bounce to the
  // matching login page.
  if (isAdminPath && !data.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  if (isTeamPath && !data.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/team/login";
    return NextResponse.redirect(url);
  }

  // Already logged in, trying to view a login page -> send them where
  // they belong instead.
  if (isAdminLogin && data.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }
  if (isTeamLogin && data.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/team";
    return NextResponse.redirect(url);
  }

  // Logged in and hitting /admin/* -> must actually be an admin, not
  // just any team member.
  if (isAdminPath && data.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/team";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/team/:path*"],
};
