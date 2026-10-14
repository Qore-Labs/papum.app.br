import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { EstablishmentForm } from "@/components/forms/establishment-form";

function renderForm() {
  return render(
    <EstablishmentForm
      heading={<h1>Novo Estabelecimento</h1>}
      sectionHeadings={[
        {
          id: "information",
          content: (
            <h2 id="establishment-information-title">
              Informações do Estabelecimento
            </h2>
          ),
        },
        {
          id: "hours",
          content: (
            <h2 id="establishment-hours-title">Horário de Funcionamento</h2>
          ),
        },
        {
          id: "address",
          content: <h2 id="establishment-address-title">Endereço Completo</h2>,
        },
        {
          id: "banking",
          content: <h2 id="establishment-banking-title">Dados Bancários</h2>,
        },
      ]}
    />,
  );
}

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  const values = [
    ["Nome do Estabelecimento", "Restaurante da Prévia"],
    ["Telefone de Contato", "11987654321"],
    ["CNPJ", "12.ABC.345/01DE-35"],
    ["Horário de Abertura", "18:00"],
    ["Horário de Fechamento", "02:00"],
    ["CEP", "90000-000"],
    ["Rua / Logradouro", "Rua da Prévia"],
    ["Número", "123"],
    ["Bairro", "Bairro da Prévia"],
    ["Cidade", "Porto Alegre"],
    ["Agência", "1234-5"],
    ["Número da Conta", "12345-6"],
    ["Nome do Titular", "Titular da Prévia"],
    ["CPF / CNPJ do Titular", "111.444.777-35"],
  ];
  for (const [label, value] of values)
    await user.type(screen.getByLabelText(label, { exact: true }), value);
  await user.selectOptions(screen.getByLabelText("Tipo de Cozinha"), "burgers");
  await user.selectOptions(
    screen.getByLabelText("Banco", { exact: true }),
    "bb",
  );
  await user.selectOptions(screen.getByLabelText("Tipo de Conta"), "checking");
}

describe("EstablishmentForm", () => {
  it("inicia com Domingo e RS selecionados como no Figma", () => {
    renderForm();
    expect(screen.getByRole("checkbox", { name: "Domingo" })).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Segunda-feira" }),
    ).not.toBeChecked();
    expect(screen.getByLabelText("Estado")).toHaveValue("RS");
    expect(screen.getByRole("link", { name: "Cancelar" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
  });
  it("informa erros e move foco ao primeiro campo inválido", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("checkbox", { name: "Domingo" }));
    await user.click(
      screen.getByRole("button", { name: "Finalizar Cadastro" }),
    );
    expect(
      await screen.findByText("Informe o nome do estabelecimento."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Nome do Estabelecimento")).toHaveFocus();
    expect(screen.getByLabelText("CNPJ", { exact: true })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
  it("seleciona dias e valida a ausência de dia", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("checkbox", { name: "Domingo" }));
    await user.click(
      screen.getByRole("button", { name: "Finalizar Cadastro" }),
    );
    expect(
      await screen.findByText("Selecione pelo menos um dia de funcionamento."),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "Segunda-feira" }));
    expect(
      screen.getByRole("checkbox", { name: "Segunda-feira" }),
    ).toBeChecked();
  });
  it("verifica CEP e orienta endereço manual sem inventar uma consulta", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: "Verificar CEP" }));
    expect(
      await screen.findByText("Informe um CEP com 8 dígitos."),
    ).toBeInTheDocument();
    await user.type(screen.getByLabelText("CEP", { exact: true }), "90000-000");
    await user.click(screen.getByRole("button", { name: "Verificar CEP" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Preencha o endereço manualmente nesta prévia",
    );
    expect(screen.getByLabelText("Rua / Logradouro")).toHaveValue("");
    expect(screen.getByLabelText("Rua / Logradouro")).toHaveFocus();
  });
  it("confirma o cadastro válido apenas na prévia local", async () => {
    const user = userEvent.setup();
    renderForm();
    await fillForm(user);
    await user.click(
      screen.getByRole("button", { name: "Finalizar Cadastro" }),
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Cadastro de Restaurante da Prévia validado nesta prévia",
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
  it("Novo Cadastro limpa valores, erros e restaura o foco e defaults", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.type(
      screen.getByLabelText("Nome do Estabelecimento"),
      "Descartar",
    );
    await user.click(screen.getByRole("checkbox", { name: "Domingo" }));
    await user.click(
      screen.getByRole("button", { name: "Finalizar Cadastro" }),
    );
    await screen.findByText("Selecione pelo menos um dia de funcionamento.");
    await user.click(screen.getByRole("button", { name: "Novo Cadastro" }));
    expect(screen.getByLabelText("Nome do Estabelecimento")).toHaveValue("");
    expect(screen.getByLabelText("Nome do Estabelecimento")).toHaveFocus();
    expect(screen.getByRole("checkbox", { name: "Domingo" })).toBeChecked();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
