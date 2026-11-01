"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { TurnstileVerification } from "@/components/forms/turnstile-verification";
import {
  trackLaunchLead,
  trackWaitlistAttempt,
  trackWaitlistError,
  trackWaitlistStart,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { LeadEntry } from "@/utils/config/attribution";
import {
  waitlistFormSchema,
  type WaitlistFormValues,
} from "@/schemas/waitlist-form";
import type {
  LaunchInterestRequest,
  WaitlistSubmissionResult,
} from "@/types/waitlist";

export type { WaitlistSubmissionResult } from "@/types/waitlist";

interface WaitlistFormProps {
  subscribeAction?: (
    values: LaunchInterestRequest,
  ) => Promise<WaitlistSubmissionResult>;
  turnstileSiteKey?: string;
  variant?: "campaign" | "landing";
  entry?: LeadEntry;
}

const unavailableMessage =
  "Não foi possível concluir o cadastro agora. Tente novamente em breve.";
const verificationRequiredMessage =
  "Conclua a verificação de segurança e tente novamente.";

export function WaitlistForm({
  subscribeAction,
  turnstileSiteKey,
  variant = "campaign",
  entry = "lancamento",
}: WaitlistFormProps) {
  const [result, setResult] = useState<WaitlistSubmissionResult | null>(null);
  const [verificationToken, setVerificationToken] = useState("");
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const tokenRequest = useRef<{
    resolve: (token: string) => void;
    reject: () => void;
    timer: ReturnType<typeof setTimeout>;
  } | null>(null);
  const [website, setWebsite] = useState("");
  const onVerified = useCallback((token: string) => {
    setVerificationToken(token);
    if (tokenRequest.current) {
      clearTimeout(tokenRequest.current.timer);
      tokenRequest.current.resolve(token);
      tokenRequest.current = null;
      setIsVerifying(false);
    }
    setResult((current) =>
      current?.message === verificationRequiredMessage ? null : current,
    );
  }, []);
  const onInvalidVerification = useCallback(() => {
    setVerificationToken("");
    if (tokenRequest.current) {
      clearTimeout(tokenRequest.current.timer);
      tokenRequest.current.reject();
      tokenRequest.current = null;
    }
  }, []);
  useEffect(
    () => () => {
      if (tokenRequest.current) {
        clearTimeout(tokenRequest.current.timer);
        tokenRequest.current.reject();
        tokenRequest.current = null;
      }
    },
    [],
  );
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
      trackWaitlistError("unavailable");
      setResult({ status: "error", message: unavailableMessage });
      return;
    }
    if (variant !== "landing" && turnstileSiteKey && !verificationToken) {
      trackWaitlistError("verification_required");
      setResult({
        status: "error",
        message: verificationRequiredMessage,
      });
      return;
    }

    try {
      let token = verificationToken;
      if (variant === "landing" && turnstileSiteKey && !token) {
        setVerificationRequested(true);
        setIsVerifying(true);
        token = await new Promise<string>((resolve, reject) => {
          tokenRequest.current = {
            resolve,
            reject: () => reject(new Error("verification")),
            timer: setTimeout(() => {
              tokenRequest.current?.reject();
              tokenRequest.current = null;
            }, 60000),
          };
        });
      }
      const response = await subscribeAction({
        ...values,
        verificationToken: token,
        website,
        entry,
      });
      setResult(response);
      if (response.status === "success") {
        reset();
        trackLaunchLead();
      } else trackWaitlistError("submission_failed");
    } catch (error) {
      const verificationFailed =
        error instanceof Error && error.message === "verification";
      trackWaitlistError(
        verificationFailed ? "verification_required" : "submission_failed",
      );
      setResult({
        status: "error",
        message: verificationFailed
          ? "Não foi possível concluir a verificação. Tente novamente ou entre em contato pelo link no rodapé."
          : unavailableMessage,
      });
    } finally {
      if (tokenRequest.current) {
        clearTimeout(tokenRequest.current.timer);
        tokenRequest.current = null;
      }
      setVerificationRequested(false);
      setIsVerifying(false);
      setVerificationToken("");
      setVerificationAttempt((current) => current + 1);
    }
  }

  return (
    <form
      onSubmit={(event) => {
        trackWaitlistAttempt();
        void handleSubmit(onSubmit, () => trackWaitlistError("invalid_email"))(
          event,
        );
      }}
      data-clarity-mask="true"
      noValidate
      aria-label={
        variant === "landing"
          ? "Cadastro de interesse"
          : "Receber aviso de lançamento"
      }
      aria-busy={isSubmitting}
      className={cn(
        "w-full",
        variant === "landing" ? "landing-waitlist" : "max-w-112",
      )}
    >
      <div hidden aria-hidden="true">
        <label htmlFor="waitlist-website">Deixe este campo vazio</label>
        <input
          id="waitlist-website"
          name="website"
          type="text"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {variant === "landing" && (
        <label htmlFor="waitlist-email" className="waitlist-email-label">
          Seu e-mail
        </label>
      )}
      <div
        className={cn(
          "waitlist-fields flex flex-col gap-3 sm:flex-row",
          variant === "landing" && "gap-0",
        )}
      >
        <div className="min-w-0 flex-1">
          {variant !== "landing" && (
            <label htmlFor="waitlist-email" className="sr-only">
              Seu e-mail
            </label>
          )}
          <input
            id="waitlist-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="seu@email.com"
            required
            maxLength={254}
            disabled={isSubmitting}
            onFocus={trackWaitlistStart}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "waitlist-email-error" : undefined}
            className="waitlist-input focus-visible:outline-home-orange h-[58.212px] w-full rounded-full border border-white/24 bg-white/15 px-6 text-base text-white outline-hidden placeholder:text-[#ddd] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solid disabled:opacity-70"
            {...register("email", { onChange: () => setResult(null) })}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="waitlist-submit bg-home-orange focus-visible:outline-home-orange h-[58.212px] w-full shrink-0 rounded-full px-7 py-4 text-base font-semibold text-[#613100] shadow-[0_10px_15px_rgba(255,138,0,0.3),0_4px_6px_rgba(255,138,0,0.3)] hover:bg-[#ff9c26] focus-visible:outline-offset-4 sm:w-50.25"
        >
          {isSubmitting
            ? isVerifying
              ? "Verificando..."
              : "Enviando..."
            : variant === "landing"
              ? "Cadastrar-se"
              : "Quero ser avisado"}
        </Button>
      </div>

      {turnstileSiteKey && (variant !== "landing" || verificationRequested) && (
        <TurnstileVerification
          key={verificationAttempt}
          siteKey={turnstileSiteKey}
          onToken={onVerified}
          onInvalid={onInvalidVerification}
          appearance={variant === "landing" ? "interaction-only" : "always"}
          theme={variant === "landing" ? "light" : "dark"}
        />
      )}
      {isVerifying && (
        <p role="status" className="waitlist-feedback mt-3 text-sm">
          Confirmando a segurança do envio.{" "}
          <button
            type="button"
            onClick={onInvalidVerification}
            className="underline underline-offset-2"
          >
            Cancelar
          </button>
        </p>
      )}
      <p className="waitlist-notice mt-3 text-center text-xs leading-5 text-zinc-300">
        <span>
          Cadastro de interesse. Avisaremos por e-mail quando a plataforma
          estiver disponível.
        </span>{" "}
        <span>
          Você pode cancelar respondendo ao e-mail.{" "}
          <a href="/privacidade" className="underline underline-offset-2">
            Privacidade
          </a>
          .
        </span>
      </p>

      {errors.email && (
        <p
          id="waitlist-email-error"
          role="alert"
          className="waitlist-feedback mt-3 text-center text-sm leading-5 text-red-200"
          data-error="true"
        >
          {errors.email.message}
        </p>
      )}
      {result && (
        <p
          role={result.status === "success" ? "status" : "alert"}
          data-error={result.status === "error"}
          className={cn(
            "waitlist-feedback mt-3 text-center text-sm leading-5",
            result.status === "success" ? "text-green-200" : "text-red-200",
          )}
        >
          {result.message}
        </p>
      )}
    </form>
  );
}
