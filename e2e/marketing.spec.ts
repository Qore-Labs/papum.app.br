import { test, expect } from "./support/fixtures";

test("Planos e Começar agora abrem o lançamento em outra aba", async ({
  page,
}) => {
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Abrir menu", exact: true });
  if (await menu.isVisible()) await menu.click();
  const plans = page.getByRole("link", { name: "Planos", exact: true });
  await expect(plans).toHaveAttribute("href", "/lancamento");
  await expect(plans).toHaveAttribute("target", "_blank");
  const plansPopup = page.waitForEvent("popup");
  await plans.click();
  const launch = await plansPopup;
  await expect(launch).toHaveURL(/\/lancamento$/);
  await expect(launch.getByRole("heading", { level: 1 })).toContainText(
    "quase no ar",
  );
  await launch.close();
  await expect(
    page.getByRole("dialog", { name: "Menu", exact: true }),
  ).not.toBeVisible();

  const start = page.getByRole("link", { name: "Começar Agora", exact: true });
  await expect(start).toHaveAttribute("target", "_blank");
  const startPopup = page.waitForEvent("popup");
  await start.click();
  const secondLaunch = await startPopup;
  await expect(secondLaunch).toHaveURL(/\/lancamento$/);
  await expect(
    secondLaunch.getByRole("textbox", { name: "Seu e-mail" }),
  ).toBeVisible();
  await secondLaunch.close();
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
