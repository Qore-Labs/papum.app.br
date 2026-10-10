import { type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant =
  "primary" | "secondary" | "ghost" | "accent" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-700",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
  ghost: "bg-transparent text-zinc-900 hover:bg-zinc-100",
  accent: "bg-white text-zinc-900 hover:bg-zinc-100",
  danger: "bg-brand-red text-white hover:bg-brand-red-dark",
  outline: "border border-white bg-transparent text-white hover:bg-white/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
