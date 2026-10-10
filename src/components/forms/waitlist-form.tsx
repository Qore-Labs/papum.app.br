"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  waitlistFormSchema,
  type WaitlistFormValues,
} from "@/schemas/waitlist-form";

export interface WaitlistSubmissionResult {
  status: "success" | "error";
  message: string;
}

interface WaitlistFormProps {
  subscribeAction?: (
    values: WaitlistFormValues,
  ) => Promise<WaitlistSubmissionResult>;
}

const unavailableMessage =
  "Não foi possível concluir o cadastro agora. Tente novamente em breve.";

export function WaitlistForm({ subscribeAction }: WaitlistFormProps) {
  const [result, setResult] = useState<WaitlistSubmissionResult | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: WaitlistFormValues) {
    setResult(null);
    if (!subscribeAction) {
      setResult({ status: "error", message: unavailableMessage });
      return;
    }

    try {
      const response = await subscribeAction(values);
      setResult(response);
      if (response.status === "success") reset();
    } catch {
      setResult({ status: "error", message: unavailableMessage });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Receber aviso de lançamento"
      aria-busy={isSubmitting}
      className="w-full max-w-112"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="min-w-0 flex-1">
          <label htmlFor="waitlist-email" className="sr-only">
            Seu e-mail
          </label>
          <input
            id="waitlist-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="seu@email.com"
            required
            maxLength={254}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "waitlist-email-error" : undefined}
            className="focus-visible:outline-home-orange h-[58.212px] w-full rounded-full border border-white/24 bg-white/15 px-6 text-base text-white outline-hidden placeholder:text-[#ddd] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solid disabled:opacity-70"
            {...register("email", { onChange: () => setResult(null) })}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="bg-home-orange focus-visible:outline-home-orange h-[58.212px] w-full shrink-0 rounded-full px-7 py-4 text-base font-semibold text-[#613100] shadow-[0_10px_15px_rgba(255,138,0,0.3),0_4px_6px_rgba(255,138,0,0.3)] hover:bg-[#ff9c26] focus-visible:outline-offset-4 sm:w-50.25"
        >
          {isSubmitting ? "Enviando..." : "Quero ser avisado"}
        </Button>
      </div>

      {errors.email && (
        <p
          id="waitlist-email-error"
          role="alert"
          className="mt-3 text-center text-sm leading-5 text-red-200"
        >
          {errors.email.message}
        </p>
      )}
      {result && (
        <p
          role={result.status === "success" ? "status" : "alert"}
          className={cn(
            "mt-3 text-center text-sm leading-5",
            result.status === "success" ? "text-green-200" : "text-red-200",
          )}
        >
          {result.message}
        </p>
      )}
    </form>
  );
}
