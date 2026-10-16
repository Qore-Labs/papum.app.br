import { test, expect } from "./support/fixtures";

test("login da prévia abre o dashboard e permite navegar pelas abas", async ({
  page,
}) => {
  await page.goto("/login");
  await page
    .getByRole("textbox", { name: "Email ou Telefone" })
    .fill("qa@example.com");
  await page.getByLabel("Senha", { exact: true }).fill("senha-de-teste");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  const routes = [
    { label: "Cardápio", path: "/dashboard/cardapio" },
    { label: "Clientes", path: "/dashboard/clientes" },
    { label: "Configurações", path: "/dashboard/configuracoes" },
    { label: "Pedidos", path: "/dashboard" },
  ];
  for (const route of routes) {
    const trigger = page.getByRole("button", { name: "Abrir menu do painel" });
    if (await trigger.isVisible()) await trigger.click();
    const link = page
      .getByRole("navigation", { name: "Navegação do painel" })
      .getByRole("link", { name: route.label, exact: true });
    await link.click();
    await expect(page).toHaveURL(`http://127.0.0.1:3100${route.path}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("dialog", { name: "Menu do painel" }),
    ).not.toBeVisible();
    const dimensions = await page.evaluate(() => ({
      viewport: innerWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
  }
});

test("cria e edita um item do cardápio na prévia", async ({ page }) => {
  await page.goto("/dashboard/cardapio");
  await page.getByRole("button", { name: "Novo Item", exact: true }).click();
  const create = page.getByRole("dialog", { name: "Novo item", exact: true });
  await create.getByLabel("Nome do produto", { exact: true }).fill("Burger CI");
  await create
    .getByLabel("Descrição", { exact: true })
    .fill("Sanduíche de teste com queijo e salada.");
  await create.getByLabel("Preço (R$)", { exact: true }).fill("29,90");
  await create.getByRole("button", { name: "Salvar item" }).click();
  const product = page.getByRole("article", { name: "Burger CI", exact: true });
  await expect(product).toBeVisible();
  await expect(product).toContainText(/29,90/);
  await product
    .getByRole("button", { name: "Editar Burger CI", exact: true })
    .click();
  const edit = page.getByRole("dialog", { name: "Editar item", exact: true });
  await edit
    .getByLabel("Nome do produto", { exact: true })
    .fill("Burger CI atualizado");
  await edit.getByLabel("Preço (R$)", { exact: true }).fill("32,90");
  await edit.getByRole("button", { name: "Salvar item" }).click();
  const updated = page.getByRole("article", {
    name: "Burger CI atualizado",
    exact: true,
  });
  await expect(updated).toBeVisible();
  await expect(updated).toContainText(/32,90/);
});

test("cadastra e edita um cliente pelo menu de ações", async ({ page }) => {
  await page.goto("/dashboard/clientes");
  await page.getByRole("button", { name: "Novo Cliente", exact: true }).click();
  const create = page.getByRole("dialog", {
    name: "Novo cliente",
    exact: true,
  });
  await create.getByLabel("Nome completo").fill("Cliente CI");
  await create
    .getByLabel("E-mail", { exact: true })
    .fill("qa-customer@example.com");
  await create.getByLabel("Telefone com DDD").fill("11987654321");
  await create.getByRole("button", { name: "Salvar cliente" }).click();
  const actions = page.getByRole("button", {
    name: "Ações de Cliente CI",
    exact: true,
  });
  await expect(actions).toBeVisible();
  await actions.click();
  await page
    .getByRole("button", { name: "Editar cliente", exact: true })
    .click();
  const edit = page.getByRole("dialog", {
    name: "Editar cliente",
    exact: true,
  });
  await expect(edit.getByLabel("E-mail", { exact: true })).toHaveValue(
    "qa-customer@example.com",
  );
  await edit.getByLabel("Nome completo").fill("Cliente CI atualizado");
  await edit.getByLabel("Status do cliente").selectOption("vip");
  await edit.getByRole("button", { name: "Salvar cliente" }).click();
  await expect(
    page.getByRole("button", {
      name: "Ações de Cliente CI atualizado",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "Cliente CI atualizado salvo nesta prévia.",
  );
});
