import Link from "next/link";
import { SignupLink } from "@/components/home/signup-link";

import { LogoWhite } from "@/components/ui/icons";
import { siteConfig } from "@/utils/config/site";

import { MainNav } from "./main-nav";
import { MobileNavToggle } from "./mobile-nav-toggle";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 pt-[env(safe-area-inset-top)]">
      <div className="site-safe-gutter mx-auto flex h-20.5 max-w-320 items-center justify-between [--site-gutter:29px] max-sm:[--site-gutter:1.25rem]">
        <Link
          href="/"
          aria-label="PáPum! — página inicial"
          className="focus-visible:outline-home-ink rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <LogoWhite
            aria-hidden="true"
            className="text-home-ink h-16.5 w-[171px] max-sm:h-14 max-sm:w-[145px]"
          />
        </Link>
        <div className="ml-auto flex items-center gap-[35px]">
          <MainNav links={siteConfig.navLinks} />
          <div className="hidden md:block">
            <SignupLink location="header" />
          </div>
          <MobileNavToggle links={siteConfig.navLinks} />
        </div>
      </div>
    </header>
  );
}
