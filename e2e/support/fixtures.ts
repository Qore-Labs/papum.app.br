import { expect, test as base } from "@playwright/test";

const verificationScript = `
  const widgets = new Map();
  window.turnstile = {
    render(element, options) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Concluir verificação simulada";
      button.onclick = () => options.callback("e2e-valid-token");
      element.append(button);
      const fail = event => options["error-callback"](event.detail);
      window.addEventListener("e2e:verification-error", fail);
      widgets.set("e2e-widget", { element, options, fail });
      return "e2e-widget";
    },
    reset(id) { widgets.get(id)?.options.callback("e2e-valid-token"); },
    remove(id) {
      const widget = widgets.get(id);
      if (!widget) return;
      window.removeEventListener("e2e:verification-error", widget.fail);
      widget.element.replaceChildren();
      widgets.delete(id);
    }
  };
`;

export const test = base.extend({
  context: async ({ context }, run) => {
    const unexpectedHosts: string[] = [];
    await context.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin === "http://127.0.0.1:3100") return route.continue();
      if (
        url.origin === "https://challenges.cloudflare.com" &&
        url.pathname === "/turnstile/v0/api.js"
      ) {
        return route.fulfill({
          contentType: "application/javascript",
          body: verificationScript,
        });
      }
      unexpectedHosts.push(url.hostname);
      return route.abort("blockedbyclient");
    });
    await run(context);
    expect(
      unexpectedHosts,
      "Os testes não devem chamar serviços externos",
    ).toEqual([]);
  },
  page: async ({ page }, run) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await run(page);
    expect(errors, "A página não deve ter erros de execução").toEqual([]);
  },
});

export { expect };
