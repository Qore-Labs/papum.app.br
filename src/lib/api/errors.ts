export interface ApiFailure {
  code: string;
  message: string;
  status: number;
  fields: Record<string, string[]>;
  retryAfter: number | null;
}

export class ApiError extends Error implements ApiFailure {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 0,
    public readonly fields: Record<string, string[]> = {},
    public readonly retryAfter: number | null = null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function toApiFailure(error: unknown): ApiFailure {
  if (error instanceof ApiError) {
    return {
      code: error.code,
      message: error.message,
      status: error.status,
      fields: error.fields,
      retryAfter: error.retryAfter,
    };
  }
  return {
    code: "unexpected_error",
    message: "Não foi possível concluir a operação.",
    status: 0,
    fields: {},
    retryAfter: null,
  };
}

export function invalidApiInput(): ApiError {
  return new ApiError("invalid_input", "Confira os dados enviados.", 422);
}
