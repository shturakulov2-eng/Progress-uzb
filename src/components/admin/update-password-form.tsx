"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  clearRecoveryPendingCookie,
  RECOVERY_LOGIN_PATH,
  setRecoveryPendingCookie,
} from "@/lib/auth-recovery";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ready, setReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function prepareSession() {
      setError("");
      setSuccess("");

      const hash = window.location.hash.replace(/^#/, "");
      if (hash.includes("access_token") && hash.includes("refresh_token")) {
        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const type = params.get("type");

        if (access_token && refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (sessionError) {
            setError(sessionError.message);
            setReady(false);
            return;
          }

          if (type === "recovery") {
            setRecoveryPendingCookie();
          }

          window.history.replaceState(null, "", window.location.pathname);
        }
      }

      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          setError(exchangeError.message);
          setReady(false);
          return;
        }

        setRecoveryPendingCookie();
        window.history.replaceState(null, "", window.location.pathname);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "Password reset session not found. Request a new reset link from the admin login page.",
        );
        setReady(false);
        return;
      }

      setRecoveryPendingCookie();
      setReady(true);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryPendingCookie();
        setReady(true);
        setError("");
      }
    });

    void prepareSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
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

      clearRecoveryPendingCookie();
      await supabase.auth.signOut();

      setSuccess("Password updated successfully. Redirecting to login…");
      router.push(`${RECOVERY_LOGIN_PATH}?message=password-updated`);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!ready && !error) {
    return (
      <p className="text-sm text-slate-600">Verifying password reset session…</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          New password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={!ready || isSubmitting}
          className="admin-field"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirm" className="text-sm font-medium text-slate-700">
          Confirm new password
        </label>
        <input
          id="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          disabled={!ready || isSubmitting}
          className="admin-field"
        />
      </div>
      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}
      <Button
        type="submit"
        size="large"
        className="w-full"
        disabled={!ready || isSubmitting}
      >
        {isSubmitting ? "Saving…" : "Set New Password"}
      </Button>
    </form>
  );
}
