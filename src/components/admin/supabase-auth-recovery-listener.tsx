"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  buildUpdatePasswordUrl,
  isRecoveryHash,
  isRecoverySearch,
  RECOVERY_UPDATE_PATH,
  setRecoveryPendingCookie,
} from "@/lib/auth-recovery";
import { hasSupabaseConfig } from "@/lib/supabase-config";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

function shouldRedirectToUpdatePassword(pathname: string) {
  return pathname !== RECOVERY_UPDATE_PATH;
}

export function SupabaseAuthRecoveryListener() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasSupabaseConfig()) return;

    const supabase = createSupabaseBrowserClient();

    function redirectToUpdatePassword() {
      if (!shouldRedirectToUpdatePassword(pathname)) return;

      setRecoveryPendingCookie();
      const target = buildUpdatePasswordUrl(
        window.location.origin,
        window.location.hash,
        window.location.search,
      );
      router.replace(target);
    }

    const hashRecovery = isRecoveryHash(window.location.hash);
    const searchRecovery = isRecoverySearch(window.location.search);

    if (hashRecovery || searchRecovery) {
      redirectToUpdatePassword();
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryPendingCookie();
        if (shouldRedirectToUpdatePassword(pathname)) {
          router.replace(RECOVERY_UPDATE_PATH);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  return null;
}
