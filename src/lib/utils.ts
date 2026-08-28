import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * `true` quando o href aponta para fora do projeto (protocolo absoluto,
 * `mailto:`, `tel:` ou `//`). Links internos devem usar `next/link`;
 * externos, uma âncora com `target="_blank"` e `rel="noopener noreferrer"`.
 */
export function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:|\/\/)/.test(href);
}
