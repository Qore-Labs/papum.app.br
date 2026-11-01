export const SITE_THEMES = {
  hero: {
    stops: ["#ffc400", "#ffbc00", "#ff9500"],
    canvas: "#ffc400",
  },
  light: {
    stops: ["#faf9f5", "#faf9f5", "#faf9f5"],
    canvas: "#faf9f5",
  },
  dark: {
    stops: ["#191817", "#191817", "#191817"],
    canvas: "#191817",
  },
  yellow: {
    stops: ["#ffc400", "#ffc400", "#ffc400"],
    canvas: "#ffc400",
  },
  footer: {
    stops: ["#f0eee7", "#f0eee7", "#f0eee7"],
    canvas: "#f0eee7",
  },
} as const;

export type SiteTheme = keyof typeof SITE_THEMES;

export function isSiteTheme(value?: string): value is SiteTheme {
  return Boolean(value && Object.hasOwn(SITE_THEMES, value));
}
