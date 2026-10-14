"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { MailIcon, PasswordHiddenIcon } from "@/components/ui/icons";
import { loginFormSchema, type LoginFormValues } from "@/schemas/login-form";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async () => {
    // Navegação da prévia frontend; a futura Server Action validará a autenticação.
    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Entrar na sua conta"
      aria-busy={isSubmitting}
      className="text-brand-ink flex flex-col gap-6"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="identifier"
            className="text-brand-ink font-jakarta text-sm leading-5 font-semibold"
          >
            Email ou Telefone
          </label>
          <div className="relative">
            <input
              id="identifier"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              disabled={isSubmitting}
              placeholder="exemplo@email.com"
              className="text-brand-ink placeholder:text-brand-muted/80 font-vietnam bg-auth-field ring-auth-border/15 focus-visible:outline-auth-link h-13 w-full rounded-xl py-4 pr-10 pl-4 text-base leading-5 shadow-xs ring-1 outline-hidden ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid disabled:opacity-70"
              aria-invalid={Boolean(errors.identifier)}
              aria-describedby={
                errors.identifier ? "identifier-error" : undefined
              }
              {...register("identifier")}
            />
            <MailIcon
              aria-hidden="true"
              className="text-brand-muted/50 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
            />
          </div>
          {errors.identifier && (
            <p
              id="identifier-error"
              role="alert"
              className="font-vietnam text-auth-link text-sm leading-5"
            >
              {errors.identifier.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-brand-ink font-jakarta text-sm leading-5 font-semibold"
            >
              Senha
            </label>
            <Link
              href="/esqueci-senha"
              prefetch={false}
              className="text-auth-link font-jakarta focus-visible:outline-auth-link flex min-h-11 items-center rounded-sm text-sm leading-5 font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 sm:min-h-5"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={isSubmitting}
              placeholder="••••••••"
              className="text-brand-ink placeholder:text-brand-muted/80 font-vietnam bg-auth-field ring-auth-border/15 focus-visible:outline-auth-link h-13 w-full rounded-xl py-4 pr-12 pl-4 text-base leading-5 shadow-xs ring-1 outline-hidden ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid disabled:opacity-70"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-controls="password"
              aria-pressed={showPassword}
              disabled={isSubmitting}
              className="text-brand-muted/80 focus-visible:outline-auth-link absolute top-1/2 right-0 flex size-11.5 -translate-y-1/2 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {showPassword ? (
                <Eye aria-hidden="true" className="h-[19.8px] w-5.5" />
              ) : (
                <PasswordHiddenIcon
                  aria-hidden="true"
                  className="-scale-y-100"
                />
              )}
            </button>
          </div>
          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="font-vietnam text-auth-link text-sm leading-5"
            >
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="from-home-orange font-jakarta focus-visible:outline-auth-link h-13 w-full rounded-full bg-linear-[173.219deg_in_srgb] to-[#e6182a] py-4 text-sm leading-5 font-bold text-black shadow-[0px_8px_24px_-4px_rgba(27,28,28,0.06)] hover:opacity-90"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
