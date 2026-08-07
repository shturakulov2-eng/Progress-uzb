import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { isAllowedAdminEmail } from "@/lib/admin-access";
import { hasSupabaseConfig } from "@/lib/supabase-config";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const supabaseReady = hasSupabaseConfig();

  if (supabaseReady) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && isAllowedAdminEmail(user.email)) {
        redirect("/admin/blog");
      }
    } catch (error) {
      console.error("admin login session check failed", error);
    }
  }

  const configError =
    !supabaseReady || params.error === "config"
      ? "Serverda Supabase sozlamalari yo‘q. Vercel → Settings → Environment Variables ga NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY qo‘shing, keyin Redeploy qiling."
      : params.error === "auth"
        ? "Auth tekshiruvi muvaffaqiyatsiz bo‘ldi. Qayta login qilib ko‘ring."
        : "";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(22,78,190,0.32),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_28%)]" />
      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-white shadow-2xl shadow-black/20 lg:grid-cols-[1fr_0.9fr]">
        <section className="hidden bg-[#0C3272] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">
            <ShieldCheck className="size-4" />
            Blog Admin
          </div>
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold leading-tight">
              Publish Progress blog posts from one secure panel.
            </h1>
            <p className="max-w-md text-base leading-7 text-blue-100">
              Sign in to upload an image, write a title and body, then publish.
              New posts appear on `/blog` and at the top of the homepage Blog
              section.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 text-sm leading-7 text-blue-50">
            Only authorized admin emails can publish content.
          </div>
        </section>

        <section className="space-y-6 bg-white p-8 sm:p-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0C3272]">
              Admin access
            </p>
            <h2 className="text-2xl font-semibold text-slate-950">Sign in</h2>
            <p className="text-sm leading-6 text-slate-600">
              Use your Progress admin email and password.
            </p>
          </div>
          {configError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {configError}
            </div>
          ) : null}
          <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-slate-100" />}>
            <AdminLoginForm disabled={!supabaseReady} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
