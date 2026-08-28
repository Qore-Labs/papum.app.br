import Image from "next/image";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/utils/config/site";

import { MainNav } from "./main-nav";
import { MobileNavToggle } from "./mobile-nav-toggle";

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

        <MainNav links={siteConfig.navLinks} />

        <div className="hidden md:block">
          <Button
            variant="accent"
            size="sm"
            className="rounded-full bg-white text-zinc-900"
          >
            Sign up
          </Button>
        </div>

        <MobileNavToggle links={siteConfig.navLinks} />
      </div>
    </header>
  );
}
