"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { loginFormSchema, type LoginFormValues } from "@/schemas/login-form";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    // TODO: substituir por uma Server Action de autenticação
    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="identifier"
            className="text-brand-ink font-jakarta text-sm font-semibold"
          >
            Email ou Telefone
          </label>
          <div className="relative">
            <input
              id="identifier"
              placeholder="exemplo@email.com"
              className="text-brand-ink placeholder:text-brand-muted/50 font-vietnam focus-visible:outline-brand-orange w-full rounded-xl bg-[#e9e8e8] py-4 pr-10 pl-4 text-base shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-invalid={Boolean(errors.identifier)}
              aria-describedby={
                errors.identifier ? "identifier-error" : undefined
              }
              {...register("identifier")}
            />
            <Mail className="text-brand-muted/50 pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2" />
          </div>
          {errors.identifier && (
            <span
              id="identifier-error"
              role="alert"
              className="text-sm text-red-600"
            >
              {errors.identifier.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-brand-ink font-jakarta text-sm font-semibold"
            >
              Senha
            </label>
            <Link
              href="/esqueci-senha"
              className="text-brand-red font-jakarta text-sm font-semibold"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="text-brand-ink placeholder:text-brand-muted/50 font-vietnam focus-visible:outline-brand-orange w-full rounded-xl bg-[#e9e8e8] py-4 pr-12 pl-4 text-base shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="text-brand-muted/50 focus-visible:outline-brand-orange absolute top-1/2 right-1 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <span
              id="password-error"
              role="alert"
              className="text-sm text-red-600"
            >
              {errors.password.message}
            </span>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="from-brand-orange to-brand-red font-jakarta h-auto w-full rounded-full bg-linear-to-b py-4 text-sm font-bold shadow-[0px_8px_24px_-4px_rgba(27,28,28,0.06)] hover:opacity-90"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
