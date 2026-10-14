function normalizeDocument(value: string): string {
  return value.replace(/[.\-/\s]/g, "").toUpperCase();
}

function checkDigit(value: string, kind: "cpf" | "cnpj"): number {
  const sum = [...value].reduce((total, character, index) => {
    const weight =
      kind === "cpf"
        ? value.length + 1 - index
        : ((value.length - 1 - index) % 8) + 2;
    return total + (character.charCodeAt(0) - 48) * weight;
  }, 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCpf(value: string): boolean {
  const document = normalizeDocument(value);
  if (!/^\d{11}$/.test(document) || /^(.)\1+$/.test(document)) return false;
  const first = checkDigit(document.slice(0, 9), "cpf");
  const second = checkDigit(document.slice(0, 9) + first, "cpf");
  return document.endsWith(`${first}${second}`);
}

// Receita Federal: manual-dv-cnpj.pdf. Letras mantêm o valor ASCII menos 48.
export function isValidCnpj(value: string): boolean {
  const document = normalizeDocument(value);
  if (!/^[A-Z\d]{12}\d{2}$/.test(document) || /^(.)\1+$/.test(document))
    return false;
  const first = checkDigit(document.slice(0, 12), "cnpj");
  const second = checkDigit(document.slice(0, 12) + first, "cnpj");
  return document.endsWith(`${first}${second}`);
}
