"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/content/types";
import {
  createServiceInquirySchema,
  type ServiceInquiryFormValues,
} from "@/lib/validators";

export function ServiceInquiryForm({ content }: { content: SiteContent }) {
  const { serviceInquiry } = content;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const schema = useMemo(() => createServiceInquirySchema(content), [content]);
  const form = useForm<ServiceInquiryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      source: "service-inquiry",
      fullName: "",
      phoneNumber: "",
      problem: "",
      website: "",
    },
  });

  async function onSubmit(values: ServiceInquiryFormValues) {
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
        toast.error(payload.error || serviceInquiry.errorGeneric);
        return;
      }

      form.reset();
      setIsSuccess(true);
      toast.success(payload.message || serviceInquiry.success);
    } catch {
      toast.error(serviceInquiry.errorNetwork);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-5">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-white">
          {serviceInquiry.problemLabel}
        </span>
        <textarea
          {...form.register("problem")}
          rows={5}
          aria-invalid={!!form.formState.errors.problem}
          placeholder={serviceInquiry.problemPlaceholder}
          className={`${inputStyles} min-h-32 resize-y py-3`}
        />
        <FieldError message={form.formState.errors.problem?.message} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">
            {serviceInquiry.fullNameLabel}
          </span>
          <input
            {...form.register("fullName")}
            aria-invalid={!!form.formState.errors.fullName}
            placeholder={serviceInquiry.fullNamePlaceholder}
            className={inputStyles}
          />
          <FieldError message={form.formState.errors.fullName?.message} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">
            {serviceInquiry.phoneLabel}
          </span>
          <input
            {...form.register("phoneNumber")}
            inputMode="tel"
            aria-invalid={!!form.formState.errors.phoneNumber}
            placeholder={serviceInquiry.phonePlaceholder}
            className={inputStyles}
          />
          <FieldError message={form.formState.errors.phoneNumber?.message} />
        </label>
      </div>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        {...form.register("website")}
      />

      <Button
        type="submit"
        size="large"
        disabled={isSubmitting}
        className="w-full bg-white text-slate-950 hover:bg-blue-50 sm:w-auto"
      >
        {isSubmitting ? serviceInquiry.submitting : serviceInquiry.submit}
        {!isSubmitting ? <ArrowUpRight className="ml-2 size-4" /> : null}
      </Button>

      {isSuccess ? (
        <p
          role="status"
          className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100"
        >
          {serviceInquiry.success}
        </p>
      ) : null}
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <span className="text-sm text-red-200">{message}</span> : null;
}

const inputStyles =
  "h-12 w-full rounded-2xl border border-white/15 bg-white/8 px-4 text-white outline-none placeholder:text-blue-100/50 transition focus:border-blue-200/70 focus:bg-white/12";
