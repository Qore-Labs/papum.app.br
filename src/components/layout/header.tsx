import Link from "next/link";

import { LogoWhite } from "@/components/ui/icons";
import { siteConfig } from "@/utils/config/site";

import { MainNav } from "./main-nav";
import { MobileNavToggle } from "./mobile-nav-toggle";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 bg-[#fb8d01] shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex h-20.5 max-w-320 items-center justify-between px-[29px] max-sm:px-5">
        <Link
          href="/"
          aria-label="PáPum! — página inicial"
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <LogoWhite
            aria-hidden="true"
            className="h-16.5 w-[171px] text-white max-sm:h-14 max-sm:w-[145px]"
          />
        </Link>
        <div className="ml-auto flex items-center gap-[35px]">
          <MainNav links={siteConfig.navLinks} />
          <Link
            href="/lancamento"
            data-analytics-cta="start_now"
            data-analytics-location="header"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-[#ffbb00] px-7 py-2.5 text-base leading-6 font-semibold text-[#613100] transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none md:inline-flex"
          >
            Começar agora
          </Link>
          <MobileNavToggle links={siteConfig.navLinks} />
        </div>
      </div>
    </header>
  );
}
