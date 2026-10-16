export interface TurnstileFailure {
  code: string | null;
  message: string;
  retryable: boolean;
}

export function getTurnstileFailure(value: unknown): TurnstileFailure {
  const code =
    typeof value === "string" && /^\d{6}$/.test(value) ? value : null;
  if (code === "110200")
    return {
      code,
      retryable: false,
      message:
        "A verificação não está disponível neste endereço. Avise a equipe do Pápum para liberar o acesso.",
    };
  if (code && ["110100", "110110", "400020", "400021", "400070"].includes(code))
    return {
      code,
      retryable: false,
      message:
        "A verificação está indisponível por uma configuração do site. Avise a equipe do Pápum.",
    };
  if (code === "200100")
    return {
      code,
      retryable: true,
      message:
        "Confira a data e a hora do seu aparelho e tente verificar novamente.",
    };
  if (code === "110600" || code === "110620")
    return {
      code,
      retryable: true,
      message: "A verificação expirou. Tente novamente para continuar.",
    };
  return {
    code,
    retryable: true,
    message:
      "Não foi possível conectar à verificação de segurança. Tente novamente. Se continuar, teste outro navegador ou outra rede.",
  };
}
