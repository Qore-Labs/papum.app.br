"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

import {
  isSiteTheme,
  SITE_THEMES,
  type SiteTheme,
} from "@/utils/config/site-themes";

const fills = [
  "--header-fill-a",
  "--header-fill-b",
  "--header-fill-c",
] as const;
const neutral = "#757575";

export function SiteHeaderTheme() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!header) return;
    const root = document.documentElement;
    const zones = [
      ...document.querySelectorAll<HTMLElement>("[data-header-zone]"),
    ];
    const hero = zones.find((zone) => zone.dataset.headerZone === "hero");
    const footer = zones.find((zone) => zone.dataset.headerZone === "footer");
    const dialog = header.querySelector("dialog");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canAnimate =
      typeof CSS !== "undefined" && typeof CSS.registerProperty === "function";
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    const previousMeta = meta?.content;
    const previousCanvas = root.style.getPropertyValue("--site-canvas");
    let active: SiteTheme | null = null;
    let darkInk = true;
    let frame = 0;
    let phaseTimer = 0;
    let disposePhase = () => {};
    let observer: IntersectionObserver | undefined;
    let footerVisible = false;
    let disposed = false;
    let trackingHero = false;

    function browserTheme() {
      if (!active) return;
      const theme = dialog?.open ? "dark" : active;
      const color = SITE_THEMES[theme].canvas;
      root.dataset.siteTheme = theme;
      root.style.setProperty(
        "--site-canvas",
        !dialog?.open && footerVisible ? SITE_THEMES.footer.canvas : color,
      );
      const currentMeta = document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]',
      );
      if (currentMeta && currentMeta.content !== color)
        currentMeta.content = color;
    }

    function setInk(final = false) {
      header!.style.setProperty(
        "--header-ink",
        darkInk
          ? final
            ? "#1b1c1c"
            : "#000000"
          : final
            ? "#fffaf2"
            : "#ffffff",
      );
      header!.style.setProperty(
        "--header-cta-ink",
        darkInk
          ? final
            ? "#fffaf2"
            : "#ffffff"
          : final
            ? "#1b1c1c"
            : "#000000",
      );
    }

    function paint(stops: readonly string[], cta: string) {
      fills.forEach((name, index) =>
        header!.style.setProperty(name, stops[index]),
      );
      header!.style.setProperty("--header-cta-fill", cta);
    }

    function targetPaint(theme: SiteTheme) {
      paint(SITE_THEMES[theme].stops, theme === "dark" ? "#ffc400" : "#1b1c1c");
    }

    function cancelPhase() {
      window.clearTimeout(phaseTimer);
      disposePhase();
      disposePhase = () => {};
    }

    function afterColors(duration: number, next: () => void) {
      let complete = false;
      function done() {
        if (complete || disposed) return;
        complete = true;
        cancelPhase();
        next();
      }
      function ended(event: TransitionEvent) {
        if (event.target === header && event.propertyName === fills[0]) done();
      }
      header!.addEventListener("transitionend", ended);
      disposePhase = () => header!.removeEventListener("transitionend", ended);
      phaseTimer = window.setTimeout(done, duration + 60);
    }

    function finish() {
      setInk(true);
      delete header!.dataset.transitioning;
    }

    function setTheme(theme: SiteTheme, immediate = false) {
      const first = active === null;
      active = theme;
      header!.dataset.headerTone = theme;
      browserTheme();
      cancelPhase();
      const nextDarkInk = theme !== "dark";
      if (first || immediate || reduced.matches || !canAnimate) {
        header!.style.setProperty("--header-duration", "0ms");
        darkInk = nextDarkInk;
        targetPaint(theme);
        finish();
        return;
      }

      // Resolve the current transition before retargeting it, including on quick reversals.
      getComputedStyle(header!).getPropertyValue(fills[0]);
      header!.dataset.transitioning = "true";
      setInk();
      if (darkInk === nextDarkInk) {
        header!.style.setProperty("--header-duration", "200ms");
        targetPaint(theme);
        afterColors(200, finish);
        return;
      }

      // Both pure black and white exceed 4.5:1 on this neutral bridge.
      // Invert the ink only once the entire surface is uniform, then finish the fade.
      header!.style.setProperty("--header-duration", "100ms");
      paint([neutral, neutral, neutral], neutral);
      afterColors(100, () => {
        darkInk = nextDarkInk;
        setInk();
        targetPaint(theme);
        afterColors(100, finish);
      });
    }

    function heroPosition() {
      frame = 0;
      if (!hero || active !== "hero" || disposed) return;
      const rect = hero.getBoundingClientRect();
      header!.style.setProperty("--hero-scene-width", `${rect.width}px`);
      header!.style.setProperty("--hero-scene-height", `${rect.height}px`);
      header!.style.setProperty("--hero-scene-y", `${rect.top}px`);
      header!.dataset.atTop = String(window.scrollY <= 1);
    }

    function queueHeroPosition() {
      if (!frame) frame = requestAnimationFrame(heroPosition);
    }

    function selectZone() {
      if (disposed) return;
      const line = header!.getBoundingClientRect().bottom + 1;
      const zone = zones.find((item) => {
        const rect = item.getBoundingClientRect();
        return rect.top <= line && rect.bottom > line;
      });
      const theme = isSiteTheme(zone?.dataset.headerZone)
        ? zone.dataset.headerZone
        : "light";
      if (theme !== active) setTheme(theme);
      header!.dataset.overHero = String(theme === "hero");
      if (theme === "hero") {
        if (!trackingHero)
          window.addEventListener("scroll", queueHeroPosition, {
            passive: true,
          });
        trackingHero = true;
        heroPosition();
      } else {
        if (trackingHero)
          window.removeEventListener("scroll", queueHeroPosition);
        trackingHero = false;
        header!.dataset.atTop = "false";
      }
    }

    function measure() {
      if (disposed) return;
      const height = header!.getBoundingClientRect().height;
      root.style.setProperty("--site-header-height", `${height}px`);
      observer?.disconnect();
      if ("IntersectionObserver" in window) {
        const line = Math.min(height, window.innerHeight - 2);
        observer = new IntersectionObserver(selectZone, {
          rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 2)}px 0px`,
        });
        zones.forEach((zone) => observer!.observe(zone));
      }
      selectZone();
    }

    function resume() {
      measure();
      browserTheme();
    }
    function changeMotion() {
      if (active) setTheme(active, true);
    }
    const resize = new ResizeObserver(measure);
    resize.observe(header);
    if (hero) resize.observe(hero);
    const menu = new MutationObserver(browserTheme);
    if (dialog)
      menu.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    // A short footer may never reach the header. Its canvas still needs to match
    // the lower edge for Safari's browser surface and bottom overscroll.
    const footerObserver = new IntersectionObserver(([entry]) => {
      footerVisible = entry.isIntersecting;
      browserTheme();
    });
    if (footer) footerObserver.observe(footer);
    // Next may replace viewport metadata during a client-side route transition.
    const metadata = new MutationObserver(browserTheme);
    metadata.observe(document.head, { childList: true, subtree: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pageshow", resume);
    window.addEventListener("popstate", resume);
    reduced.addEventListener("change", changeMotion);
    measure();
    header.dataset.headerReady = "true";
    void document.fonts.ready.then(() => {
      if (!disposed) measure();
    });

    return () => {
      disposed = true;
      cancelPhase();
      cancelAnimationFrame(frame);
      observer?.disconnect();
      footerObserver.disconnect();
      resize.disconnect();
      menu.disconnect();
      metadata.disconnect();
      window.removeEventListener("scroll", queueHeroPosition);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pageshow", resume);
      window.removeEventListener("popstate", resume);
      reduced.removeEventListener("change", changeMotion);
      root.style.removeProperty("--site-header-height");
      if (previousCanvas)
        root.style.setProperty("--site-canvas", previousCanvas);
      else root.style.removeProperty("--site-canvas");
      delete root.dataset.siteTheme;
      if (meta?.isConnected && previousMeta) meta.content = previousMeta;
    };
  }, [pathname]);

  return null;
}
