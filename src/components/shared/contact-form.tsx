"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/content/types";
import { createLeadSchema, type LeadFormValues } from "@/lib/validators";

export function ContactForm({
  content,
  onSuccess,
}: {
  content: SiteContent;
  onSuccess?: () => void;
}) {
  const { form } = content;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const leadSchema = useMemo(
    () => createLeadSchema(content.validation),
    [content.validation],
  );

  const formMethods = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      businessType: "",
      phoneNumber: "",
      website: "",
    },
  });

  async function onSubmit(values: LeadFormValues) {
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        toast.error(payload.error || form.errorGeneric);
        return;
      }

      formMethods.reset();
      setIsSuccess(true);
      toast.success(payload.message || form.success);
      onSuccess?.();
    } catch {
      toast.error(form.errorNetwork);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label={form.fullName}
          error={formMethods.formState.errors.fullName?.message}
        >
          <input
            {...formMethods.register("fullName")}
            aria-invalid={!!formMethods.formState.errors.fullName}
            className={inputStyles}
            placeholder={form.placeholders.fullName}
          />
        </FormField>
        <FormField
          label={form.companyName}
          error={formMethods.formState.errors.companyName?.message}
        >
          <input
            {...formMethods.register("companyName")}
            aria-invalid={!!formMethods.formState.errors.companyName}
            className={inputStyles}
            placeholder={form.placeholders.companyName}
          />
        </FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label={form.businessType}
          error={formMethods.formState.errors.businessType?.message}
        >
          <input
            {...formMethods.register("businessType")}
            aria-invalid={!!formMethods.formState.errors.businessType}
            className={inputStyles}
            placeholder={form.placeholders.businessType}
          />
        </FormField>
        <FormField
          label={form.phoneNumber}
          error={formMethods.formState.errors.phoneNumber?.message}
        >
          <input
            {...formMethods.register("phoneNumber")}
            aria-invalid={!!formMethods.formState.errors.phoneNumber}
            className={inputStyles}
            placeholder={form.placeholders.phoneNumber}
          />
        </FormField>
      </div>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        {...formMethods.register("website")}
      />

      <Button type="submit" size="large" className="w-full">
        {isSubmitting ? form.submitting : form.submit}
      </Button>

      {isSuccess ? (
        <div
          role="status"
          className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700"
        >
          {form.success}
        </div>
      ) : null}
    </form>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-white">{label}</span>
      {children}
      {error ? <span className="text-sm text-red-300">{error}</span> : null}
    </label>
  );
}

const inputStyles =
  "h-12 w-full rounded-2xl border border-white/12 bg-white/8 px-4 text-white outline-none placeholder:text-slate-400 transition focus:border-blue-200/60 focus:bg-white/12";
