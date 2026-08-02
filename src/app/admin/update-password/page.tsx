import { KeyRound } from "lucide-react";
import { Suspense } from "react";

import { UpdatePasswordForm } from "@/components/admin/update-password-form";

export default function AdminUpdatePasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(22,78,190,0.32),_transparent_40%)]" />
      <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/10 bg-white p-8 shadow-2xl">
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0C3272]/15 bg-[#0C3272]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0C3272]">
            <KeyRound className="size-3.5" />
            Password reset
          </div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Yangi parol o‘rnating
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Email dagi link orqali kirdingiz. Yangi parolni kiriting va saqlang.
          </p>
        </div>
        <Suspense
          fallback={<div className="h-40 animate-pulse rounded-2xl bg-slate-100" />}
        >
          <UpdatePasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
