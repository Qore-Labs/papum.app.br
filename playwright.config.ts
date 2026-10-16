import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 30_000,
  globalTimeout: 6 * 60_000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    browserName: "chromium",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    serviceWorkers: "block",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command:
      "pnpm build && node --import ./e2e/support/mock-providers.mjs node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NODE_ENV: "production",
      NEXT_TELEMETRY_DISABLED: "1",
      PAPUM_E2E: "1",
      DELIVERY_DATA_SOURCE: "mock",
      DELIVERY_API_BASE_URL: "http://127.0.0.1:9/api",
      NEXT_PUBLIC_GA4_ID: "",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "e2e-public-site-key",
      TURNSTILE_SECRET_KEY: "e2e-turnstile-secret",
      WAITLIST_ALLOWED_HOSTNAMES: "127.0.0.1",
      RESEND_API_KEY: "e2e-resend-api-key",
      RESEND_FROM_EMAIL: "papum@example.com",
      RESEND_NOTIFICATION_EMAIL: "notifications@example.com",
    },
  },
});
