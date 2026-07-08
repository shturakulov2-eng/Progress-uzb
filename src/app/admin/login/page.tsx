import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { isAllowedAdminEmail } from "@/lib/admin-access";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminLoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && isAllowedAdminEmail(user.email)) {
    redirect("/admin");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(22,78,190,0.32),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_28%)]" />
      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-white shadow-2xl shadow-black/20 lg:grid-cols-[1fr_0.9fr]">
        <section className="hidden bg-[#0C3272] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">
            <ShieldCheck className="size-4" />
            Protected Access
          </div>
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold leading-tight">
              Manage new leads securely from one premium dashboard.
            </h1>
            <p className="max-w-md text-base leading-7 text-blue-100">
              Sign in with your authorized admin account to view, search, export,
              and manage consultation requests submitted through Progress.uzb.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 text-sm leading-7 text-blue-50">
            Built for responsive review on desktop, tablet, and mobile devices.
          </div>
        </section>

        <section className="p-8 sm:p-10">
          <div className="mx-auto max-w-md space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0C3272]">
                Admin Login
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Welcome back
              </h2>
              <p className="text-slate-600">
                Use your protected credentials to access the Progress.uzb lead
                management dashboard.
              </p>
            </div>
            <AdminLoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
