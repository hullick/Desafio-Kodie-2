/**
 * offline          → aparelho sem internet (tela "Sem conexão")
 * unavailable      → API sobrecarregada/limite (503, 502, 504, 429) mesmo após novas tentativas
 * network          → falha de rede com o aparelho online (DNS, CORS, conexão caiu)
 * invalid-response → resposta sem JSON válido
 * http             → outro status HTTP de erro
 */
export type ApiErrorKind = 'offline' | 'unavailable' | 'network' | 'invalid-response' | 'http'

/** Erro da camada de serviço, com o tipo que a interface usa para escolher a tela. */
export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status: number | null

  constructor(kind: ApiErrorKind, message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }

  /** Vale a pena oferecer "tentar de novo". */
  get isRetryable(): boolean {
    return this.kind !== 'http'
  }
}
