"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AdminNavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function AdminNavLink({ href, children, className }: AdminNavLinkProps) {
  const isActive = usePathname() === href;
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        className,
        isActive
          ? "text-admin-accent-ink bg-[#ececec] shadow-xs"
          : "text-stone-500 hover:bg-stone-200",
      )}
    >
      {children}
    </Link>
  );
}
