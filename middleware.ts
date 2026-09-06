import { NextResponse, type NextRequest } from "next/server";

import { isAllowedAdminEmail } from "@/lib/admin-access";
import {
  RECOVERY_PENDING_COOKIE,
  RECOVERY_UPDATE_PATH,
} from "@/lib/auth-recovery";
import { hasSupabaseConfig } from "@/lib/supabase-config";
import { updateSession } from "@/lib/supabase-middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isPublicAdminPage =
    pathname === "/admin/login" || pathname === "/admin/update-password";

  // Missing env on Vercel would otherwise crash middleware with 500.
  if (!hasSupabaseConfig()) {
    if (isPublicAdminPage) {
      return NextResponse.next();
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    loginUrl.searchParams.set("error", "config");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { supabase, response } = updateSession(request);

    const recoveryPending =
      request.cookies.get(RECOVERY_PENDING_COOKIE)?.value === "1";

    if (
      recoveryPending &&
      pathname !== RECOVERY_UPDATE_PATH &&
      !isPublicAdminPage
    ) {
      const updateUrl = request.nextUrl.clone();
      updateUrl.pathname = RECOVERY_UPDATE_PATH;
      updateUrl.search = "";
      return NextResponse.redirect(updateUrl);
    }

    if (isPublicAdminPage) {
      return response;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAllowedAdminEmail(user.email)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  } catch (error) {
    console.error("admin middleware error", error);

    if (isPublicAdminPage) {
      return NextResponse.next();
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    loginUrl.searchParams.set("error", "auth");
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
