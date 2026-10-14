import type {
  EstablishmentDay,
  EstablishmentField,
  EstablishmentOption,
} from "@/types/establishment";

export const ESTABLISHMENT_DAYS = [
  { id: "mon", label: "SEG", fullName: "Segunda-feira" },
  { id: "tue", label: "TER", fullName: "Terça-feira" },
  { id: "wed", label: "QUA", fullName: "Quarta-feira" },
  { id: "thu", label: "QUI", fullName: "Quinta-feira" },
  { id: "fri", label: "SEX", fullName: "Sexta-feira" },
  { id: "sat", label: "SÁB", fullName: "Sábado" },
  { id: "sun", label: "DOM", fullName: "Domingo" },
] satisfies readonly EstablishmentDay[];

export const CUISINE_OPTIONS = [
  { value: "burgers", label: "Hamburgueria" },
  { value: "pizza", label: "Pizzaria" },
  { value: "japanese", label: "Japonesa" },
  { value: "brazilian", label: "Brasileira" },
  { value: "vegetarian", label: "Vegetariana" },
  { value: "other", label: "Outra" },
] satisfies readonly EstablishmentOption[];

export const STATE_OPTIONS = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
] satisfies readonly EstablishmentOption[];

export const BANK_OPTIONS = [
  { value: "bb", label: "Banco do Brasil" },
  { value: "caixa", label: "Caixa Econômica Federal" },
  { value: "bradesco", label: "Bradesco" },
  { value: "itau", label: "Itaú" },
  { value: "santander", label: "Santander" },
  { value: "inter", label: "Inter" },
  { value: "nubank", label: "Nubank" },
  { value: "other", label: "Outro banco" },
] satisfies readonly EstablishmentOption[];

export const ACCOUNT_TYPE_OPTIONS = [
  { value: "checking", label: "Corrente" },
  { value: "savings", label: "Poupança" },
] satisfies readonly EstablishmentOption[];

export const ESTABLISHMENT_INFORMATION_FIELDS = [
  {
    id: "name",
    label: "Nome do Estabelecimento",
    kind: "text",
    placeholder: "Ex: Precision Burger",
    autoComplete: "organization",
    maxLength: 100,
  },
  {
    id: "cuisine",
    label: "Tipo de Cozinha",
    kind: "select",
    placeholder: "Selecione uma opção",
    options: CUISINE_OPTIONS,
  },
  {
    id: "phone",
    label: "Telefone de Contato",
    kind: "text",
    type: "tel",
    placeholder: "(00) 00000-0000",
    autoComplete: "tel-national",
    maxLength: 25,
  },
  {
    id: "cnpj",
    label: "CNPJ",
    kind: "text",
    placeholder: "00.000.000/0000-00",
    autoComplete: "off",
    maxLength: 18,
  },
] satisfies readonly EstablishmentField[];

export const ESTABLISHMENT_TIME_FIELDS = [
  { id: "openingTime", label: "Horário de Abertura", kind: "time" },
  { id: "closingTime", label: "Horário de Fechamento", kind: "time" },
] satisfies readonly EstablishmentField[];

export const ESTABLISHMENT_ADDRESS_FIELDS = [
  {
    id: "postalCode",
    label: "CEP",
    kind: "postal",
    placeholder: "00000-000",
    autoComplete: "postal-code",
    inputMode: "numeric",
    maxLength: 9,
    className: "lg:col-span-4",
  },
  {
    id: "street",
    label: "Rua / Logradouro",
    kind: "text",
    placeholder: "Ex: Avenida das Esmeraldas",
    autoComplete: "address-line1",
    maxLength: 150,
    className: "lg:col-span-8",
  },
  {
    id: "number",
    label: "Número",
    kind: "text",
    placeholder: "123",
    maxLength: 12,
    className: "lg:col-span-3",
  },
  {
    id: "complement",
    label: "Complemento",
    kind: "text",
    placeholder: "Apto, Bloco, Loja",
    autoComplete: "address-line2",
    optional: true,
    maxLength: 100,
    className: "lg:col-span-5",
  },
  {
    id: "district",
    label: "Bairro",
    kind: "text",
    placeholder: "Jardim Botânico",
    maxLength: 100,
    className: "lg:col-span-4",
  },
  {
    id: "city",
    label: "Cidade",
    kind: "text",
    placeholder: "Porto Alegre",
    autoComplete: "address-level2",
    maxLength: 100,
    className: "lg:col-span-8",
  },
  {
    id: "state",
    label: "Estado",
    kind: "select",
    options: STATE_OPTIONS,
    autoComplete: "address-level1",
    className: "lg:col-span-4",
  },
] satisfies readonly EstablishmentField[];

export const ESTABLISHMENT_BANKING_FIELDS = [
  {
    id: "bank",
    label: "Banco",
    kind: "select",
    placeholder: "Selecione o banco",
    options: BANK_OPTIONS,
  },
  {
    id: "accountType",
    label: "Tipo de Conta",
    kind: "select",
    placeholder: "Corrente / Poupança",
    options: ACCOUNT_TYPE_OPTIONS,
  },
  {
    id: "agency",
    label: "Agência",
    kind: "text",
    placeholder: "0000-0",
    autoComplete: "off",
    maxLength: 8,
  },
  {
    id: "accountNumber",
    label: "Número da Conta",
    kind: "text",
    placeholder: "00000-0",
    autoComplete: "off",
    maxLength: 15,
  },
  {
    id: "holderName",
    label: "Nome do Titular",
    kind: "text",
    placeholder: "Nome completo do titular",
    autoComplete: "off",
    maxLength: 100,
  },
  {
    id: "holderDocument",
    label: "CPF / CNPJ do Titular",
    kind: "text",
    placeholder: "000.000.000-00",
    autoComplete: "off",
    maxLength: 18,
  },
] satisfies readonly EstablishmentField[];
