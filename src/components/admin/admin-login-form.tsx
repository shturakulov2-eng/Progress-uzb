"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type AdminLoginFormProps = {
  disabled?: boolean;
};

export function AdminLoginForm({ disabled = false }: AdminLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) {
      setError(
        "Supabase environment variables are missing on this deployment.",
      );
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const redirectTo = searchParams.get("redirectTo") || "/admin/blog";
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Check Supabase env vars on Vercel.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          disabled={disabled}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="admin-field"
          placeholder="admin@progress.uzb"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password
        </label>
        <div className="grid">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            disabled={disabled}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="admin-field-password col-start-1 row-start-1"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            disabled={disabled}
            aria-label={showPassword ? "Parolni yashirish" : "Parolni ko‘rsatish"}
            aria-pressed={showPassword}
            title={showPassword ? "Parolni yashirish" : "Parolni ko‘rsatish"}
            className="z-10 col-start-1 row-start-1 mr-1.5 flex size-9 self-center justify-self-end items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-[#0C3272] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C3272]/40 disabled:pointer-events-none disabled:opacity-40"
          >
            {showPassword ? (
              <EyeOff className="size-5" aria-hidden="true" />
            ) : (
              <Eye className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}
      <Button
        type="submit"
        size="large"
        className="w-full"
        disabled={disabled || isSubmitting}
      >
        <LockKeyhole className="mr-2 size-4" />
        {isSubmitting ? "Signing in..." : "Login to Blog Admin"}
        {!isSubmitting ? <ArrowRight className="ml-2 size-4" /> : null}
      </Button>
    </form>
  );
}
