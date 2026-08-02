"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function prepareSession() {
      // Recovery links put tokens in the URL hash; exchange them if present.
      const hash = window.location.hash.replace(/^#/, "");
      if (hash.includes("access_token") && hash.includes("refresh_token")) {
        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
          window.history.replaceState(null, "", window.location.pathname);
        }
      }

      // PKCE / query-code flow
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        window.history.replaceState(null, "", window.location.pathname);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "Reset sessiyasi topilmadi. Supabase dan qayta “Reset password” yuboring yoki Dashboard orqali parol qo‘ying.",
        );
        setReady(false);
        return;
      }

      setReady(true);
    }

    void prepareSession();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Parol kamida 8 ta belgidan iborat bo‘lsin.");
      return;
    }
    if (password !== confirm) {
      setError("Parollar mos kelmadi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!ready && !error) {
    return (
      <p className="text-sm text-slate-600">Reset sessiyasi tekshirilmoqda…</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Yangi parol
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={!ready}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-[#0C3272] disabled:opacity-60"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirm" className="text-sm font-medium text-slate-700">
          Parolni tasdiqlang
        </label>
        <input
          id="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          disabled={!ready}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-[#0C3272] disabled:opacity-60"
        />
      </div>
      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}
      <Button type="submit" size="large" className="w-full" disabled={!ready || isSubmitting}>
        {isSubmitting ? "Saqlanmoqda..." : "Parolni saqlash"}
      </Button>
    </form>
  );
}
