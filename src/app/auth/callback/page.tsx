import { Suspense } from "react";

import { AuthCallbackClient } from "@/components/admin/auth-callback-client";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300">
          Signing in…
        </main>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
