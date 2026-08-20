import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { MobileNavToggle } from "./mobile-nav-toggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/planos", label: "Planos" },
  { href: "/servicos", label: "Serviços" },
];

export function Header() {
  return (
    <header className="bg-brand-orange relative">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Image
          src="/home/papum-logo.png"
          alt="pápum!"
          width={171}
          height={66}
          priority
          className="h-10 w-auto"
        />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/90 hover:text-white data-[active=true]:text-white data-[active=true]:underline data-[active=true]:underline-offset-4"
              data-active={link.href === "/"}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            variant="accent"
            size="sm"
            className="rounded-full bg-white text-zinc-900"
          >
            Sign up
          </Button>
        </div>

        <MobileNavToggle links={NAV_LINKS} />
      </div>
    </header>
  );
}
