import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter, Plus_Jakarta_Sans } from "next/font/google";

import { AdminHeader } from "@/components/layout/admin-header";
import { AdminNav } from "@/components/layout/admin-nav";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ variable: "--font-inter-body", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});
const vietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-admin-shell
      data-clarity-mask="true"
      className={`${inter.variable} ${jakarta.variable} ${vietnam.variable} font-inter bg-admin-surface flex flex-1 flex-col text-stone-900`}
    >
      <a
        href="#admin-main"
        className="fixed top-3 left-3 z-50 -translate-y-32 rounded-lg bg-white px-4 py-3 font-semibold text-stone-900 shadow-lg focus:translate-y-0 focus:outline-2 focus:outline-offset-2 focus:outline-stone-900"
      >
        Pular para o conteúdo
      </a>
      <AdminHeader />
      <div className="flex min-w-0 flex-1 lg:min-h-240">
        <aside
          data-admin-sidebar
          className="hidden w-64 shrink-0 overflow-hidden bg-stone-50/70 px-6 py-7 backdrop-blur-sm lg:block"
        >
          <AdminNav
            helpId="admin-desktop-help"
            className="-mt-2.5 h-[calc(100%+0.625rem)]"
          />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      <div className="font-vietnam">
        <Footer prefetch={false} />
      </div>
    </div>
  );
}
