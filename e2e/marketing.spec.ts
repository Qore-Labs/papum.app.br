import { test, expect } from "./support/fixtures";

test("header fixo acompanha a seção e mantém cadastro visível", async ({
  page,
}) => {
  await page.goto("/instagram");
  const header = page.locator("[data-site-header]");
  await expect(header).toHaveCSS("position", "fixed");
  await expect(header).toHaveAttribute("data-header-tone", "hero");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
    "font-weight",
    "800",
  );
  await expect(page.locator(".relationship-bolt")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await page
    .locator("#como-funciona")
    .evaluate((element) =>
      window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY),
    );
  await expect(header).toHaveAttribute("data-header-tone", "dark");
  await expect(header).toHaveCSS("color", "rgb(255, 250, 242)");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    "#191817",
  );
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await expect(page.locator("html")).toHaveCSS(
    "background-color",
    "rgb(240, 238, 231)",
  );
  await page.locator(".landing-final").getByRole("link").click();
  await expect(page.getByRole("textbox", { name: "Seu e-mail" })).toBeFocused();
  await expect(page).toHaveURL(/\/instagram#cadastro$/);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.getElementById("waitlist-email")!.getBoundingClientRect()
            .top >=
          document.querySelector("[data-site-header]")!.getBoundingClientRect()
            .bottom,
      ),
    )
    .toBe(true);
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Privacidade", exact: true })
    .click();
  await expect(header).toHaveAttribute("data-header-tone", "light");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    "#faf9f5",
  );
});

test("CTAs mantem o cadastro na propria landing e preservam a entrada Instagram", async ({
  page,
  context,
}) => {
  await page.goto("/instagram");
  // A stale production stylesheet can load the new HTML without its layout.
  await expect(page.locator(".landing-hero")).toHaveCSS("position", "relative");
  await expect(page.locator(".landing-hero")).toHaveCSS(
    "background-image",
    /linear-gradient/,
  );
  await expect(page.locator(".hero-grid")).toHaveCSS("display", "grid");
  const signup = page
    .locator('section[aria-labelledby="final-cta-title"]')
    .getByRole("link");
  await signup.click();
  await expect(page).toHaveURL(/\/instagram#cadastro$/);
  await expect(page.getByRole("textbox", { name: "Seu e-mail" })).toBeFocused();
  expect(context.pages()).toHaveLength(1);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Mais controle",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^https:\/\/www\.papum\.app\.br\/?$/,
  );
});

test("landing carrega a verificação apenas no envio e mantém o cadastro na página", async ({
  page,
}) => {
  await page.goto("/instagram");
  const form = page.getByRole("form", { name: "Cadastro de interesse" });
  await expect(
    page.getByRole("group", { name: "Verificação de segurança" }),
  ).toHaveCount(0);
  await expect(page.locator("#papum-turnstile")).toHaveCount(0);
  await form
    .getByRole("textbox", { name: "Seu e-mail" })
    .fill("qa-lead@example.com");
  await form.getByRole("button", { name: "Cadastrar-se", exact: true }).click();
  await expect(
    form.getByRole("button", { name: "Verificando...", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Concluir verificação simulada" })
    .click();
  await expect(form.getByRole("status")).toContainText("Recebemos seu contato");
  await expect(form.getByRole("textbox", { name: "Seu e-mail" })).toHaveValue(
    "",
  );
  await expect(
    page.getByRole("group", { name: "Verificação de segurança" }),
  ).toHaveCount(0);
});

test("falha de verificação na landing não envia dados e permite nova tentativa", async ({
  page,
}) => {
  await page.goto("/");
  const form = page.getByRole("form", { name: "Cadastro de interesse" });
  let posts = 0;
  page.on("request", (request) => {
    if (request.method() === "POST") posts++;
  });
  await form
    .getByRole("textbox", { name: "Seu e-mail" })
    .fill("qa-lead@example.com");
  await form.getByRole("button", { name: "Cadastrar-se", exact: true }).click();
  await page
    .getByRole("button", { name: "Concluir verificação simulada" })
    .waitFor();
  await page.evaluate(() =>
    window.dispatchEvent(
      new CustomEvent("e2e:verification-error", { detail: "110200" }),
    ),
  );
  await expect(form.getByRole("alert")).toContainText(
    "Não foi possível concluir a verificação",
  );
  await expect(form.getByRole("textbox", { name: "Seu e-mail" })).toHaveValue(
    "qa-lead@example.com",
  );
  expect(posts).toBe(0);
  await form.getByRole("button", { name: "Cadastrar-se", exact: true }).click();
  await page
    .getByRole("button", { name: "Concluir verificação simulada" })
    .click();
  await expect(form.getByRole("status")).toContainText("Recebemos seu contato");
  expect(posts).toBe(1);
});

test("valida e-mail, exige verificação e recupera o cadastro após falha temporária", async ({
  page,
}) => {
  await page.goto("/lancamento");
  const form = page.getByRole("form", { name: "Receber aviso de lançamento" });
  const email = form.getByRole("textbox", { name: "Seu e-mail" });
  const submit = form.getByRole("button", { name: "Quero ser avisado" });
  let submissions = 0;
  page.on("request", (request) => {
    if (request.method() === "POST") submissions++;
  });
  await email.fill("email-invalido");
  await submit.click();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await email.fill("qa-lead@example.com");
  await submit.click();
  await expect(form.getByRole("alert")).toContainText("Conclua a verificação");
  expect(submissions).toBe(0);
  await page
    .getByRole("button", { name: "Concluir verificação simulada" })
    .waitFor();
  await page.evaluate(() =>
    window.dispatchEvent(
      new CustomEvent("e2e:verification-error", { detail: "200500" }),
    ),
  );
  await expect(form.getByText("Referência: 200500")).toBeVisible();
  const retry = form.getByRole("button", {
    name: "Tentar verificação novamente",
  });
  await retry.focus();
  await page.keyboard.press("Enter");
  await expect(form.getByRole("alert")).toHaveCount(0);
  await expect(email).toHaveValue("qa-lead@example.com");
  await expect(
    form.getByRole("group", { name: "Verificação de segurança" }),
  ).toBeFocused();
  await submit.click();
  await expect(form.getByRole("status")).toContainText(
    "Recebemos seu contato!",
  );
  await expect(email).toHaveValue("");
  expect(submissions).toBe(1);
});

test("preserva o e-mail e mostra erro quando o provedor rejeita o envio", async ({
  page,
}) => {
  await page.goto("/lancamento");
  const form = page.getByRole("form", { name: "Receber aviso de lançamento" });
  const email = form.getByRole("textbox", { name: "Seu e-mail" });
  await email.fill("qa-provider-error@example.com");
  await page
    .getByRole("button", { name: "Concluir verificação simulada" })
    .click();
  await form.getByRole("button", { name: "Quero ser avisado" }).click();
  await expect(form.getByRole("alert")).toContainText(
    "Tente novamente em breve",
  );
  await expect(email).toHaveValue("qa-provider-error@example.com");
  await expect(form.getByRole("status")).toHaveCount(0);
});

test("menu mobile fecha por Escape, clique externo e botão, devolvendo o foco", async ({
  page,
}) => {
  test.skip(
    (page.viewportSize()?.width ?? 1440) >= 768,
    "Menu público aparece abaixo de 768px",
  );
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Abrir menu", exact: true });
  const menu = page.getByRole("dialog", { name: "Menu", exact: true });
  await trigger.click();
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.mouse.click(5, 400);
  await expect(menu).not.toBeVisible();
  await trigger.click();
  await menu.getByRole("button", { name: "Fechar menu", exact: true }).click();
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
