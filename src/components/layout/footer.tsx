import Image from "next/image";
import Link from "next/link";

import { AtIcon, CommunityIcon, GlobeIcon } from "@/components/ui/icons";

const FOOTER_COLUMNS = [
  {
    title: "PÁPUM!",
    links: [
      { href: "/sobre", label: "Sobre" },
      { href: "/como-funciona", label: "Como Funciona" },
      { href: "/parceiros", label: "Parceiros" },
    ],
  },
  {
    title: "EXPLORE",
    links: [
      { href: "/planos", label: "Planos" },
      { href: "/servicos", label: "Serviços" },
      { href: "/promocoes", label: "Promoções" },
    ],
  },
  {
    title: "SUPORTE",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/termos-de-uso", label: "Termos de Uso" },
      { href: "/politica-de-privacidade", label: "Política de Privacidade" },
    ],
  },
];

const SOCIAL_LINKS = [
  { href: "https://instagram.com", label: "Instagram", icon: AtIcon },
  { href: "https://facebook.com", label: "Facebook", icon: CommunityIcon },
  { href: "https://linkedin.com", label: "LinkedIn", icon: GlobeIcon },
];

export function Footer() {
  return (
    <footer className="bg-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/home/papum-logo-footer.png"
              alt="pápum!"
              width={116}
              height={43}
              className="h-9 w-auto opacity-70"
            />
            <p className="mt-4 max-w-xs text-sm text-zinc-500">
              A revolução na forma de pedir comida. Rápido, fresco e direto na
              sua porta.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 hover:bg-zinc-300"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-brand-red text-sm font-semibold">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 hover:text-zinc-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-zinc-200 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 PáPum! Delivery. All rights reserved.</p>
          <p>Feito com carinho para os melhores restaurantes.</p>
        </div>
      </div>
    </footer>
  );
}
