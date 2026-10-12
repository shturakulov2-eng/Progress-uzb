"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import {
  RECOVERY_LOGIN_PATH,
  RECOVERY_UPDATE_PATH,
  setRecoveryPendingCookie,
} from "@/lib/auth-recovery";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { hasSupabaseConfig } from "@/lib/supabase-config";

export function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    async function finish() {
      if (!hasSupabaseConfig()) {
        router.replace(`${RECOVERY_LOGIN_PATH}?error=config`);
        return;
      }

      const code = searchParams.get("code");
      const next = searchParams.get("next") ?? RECOVERY_UPDATE_PATH;
      const safeNext =
        next.startsWith("/") && !next.startsWith("//") ? next : RECOVERY_UPDATE_PATH;

      if (!code) {
        router.replace(`${RECOVERY_LOGIN_PATH}?error=auth`);
        return;
      }

      try {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (cancelled) return;

        if (error) {
          router.replace(`${RECOVERY_LOGIN_PATH}?error=auth`);
          return;
        }

        setRecoveryPendingCookie();
        router.replace(safeNext);
      } catch {
        if (!cancelled) {
          router.replace(`${RECOVERY_LOGIN_PATH}?error=auth`);
        }
      }
    }

    void finish();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300">
      Signing in…
    </main>
  );
}
