"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { getAuthCallbackUrl } from "@/lib/auth-recovery";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type ForgotPasswordFormProps = {
  disabled?: boolean;
};

export function ForgotPasswordForm({ disabled = false }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) {
      setError("Supabase is not configured on this deployment.");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = getAuthCallbackUrl(window.location.origin);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo },
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(
        "If an account exists for this email, a password reset link has been sent.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send reset email. Try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-200 pt-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900">Forgot password?</h3>
        <p className="text-sm leading-6 text-slate-600">
          Enter your admin email to receive a reset link.
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="reset-email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="reset-email"
          type="email"
          required
          autoComplete="email"
          disabled={disabled || isSubmitting}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="admin-field"
          placeholder="admin@progress.uzb"
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
        variant="secondary"
        size="large"
        className="w-full"
        disabled={disabled || isSubmitting}
      >
        {isSubmitting ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
