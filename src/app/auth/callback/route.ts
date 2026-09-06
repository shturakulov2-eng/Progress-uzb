import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  RECOVERY_PENDING_COOKIE,
  RECOVERY_LOGIN_PATH,
  RECOVERY_UPDATE_PATH,
} from "@/lib/auth-recovery";
import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase-config";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? RECOVERY_UPDATE_PATH;
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : RECOVERY_UPDATE_PATH;

  if (!hasSupabaseConfig()) {
    return NextResponse.redirect(new URL(`${RECOVERY_LOGIN_PATH}?error=config`, origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL(`${RECOVERY_LOGIN_PATH}?error=auth`, origin));
  }

  const { url, anonKey } = getSupabaseConfig();
  const response = NextResponse.redirect(new URL(safeNext, origin));

  try {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("auth callback exchange failed", error);
      return NextResponse.redirect(new URL(`${RECOVERY_LOGIN_PATH}?error=auth`, origin));
    }

    response.cookies.set(RECOVERY_PENDING_COOKIE, "1", {
      path: "/",
      maxAge: 60 * 60,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("auth callback unexpected", error);
    return NextResponse.redirect(new URL(`${RECOVERY_LOGIN_PATH}?error=auth`, origin));
  }
}
