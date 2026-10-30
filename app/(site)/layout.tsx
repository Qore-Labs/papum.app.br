import type { Viewport } from "next";
import { Be_Vietnam_Pro, Plus_Jakarta_Sans } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["700"],
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#fb8d01",
  viewportFit: "cover",
  colorScheme: "light",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      data-site-shell
      className={`${beVietnamPro.variable} ${plusJakartaSans.variable} font-vietnam text-home-ink bg-white`}
    >
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer analyticsEnabled />
    </div>
  );
}
