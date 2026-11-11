import { ApiError, type ApiErrorKind } from './ApiError'

export type ErrorRoute = '/sem-conexao' | '/erro'

/** Dados que a tela de erro recebe no `state` da navegação. */
export type ErrorRouteState = {
  /** Rota onde o erro aconteceu (para "Tentar novamente" voltar a ela). */
  from: string
  /** Status HTTP da última resposta, se houve. */
  status: number | null
  /** Tipo do erro (ex.: "blocked" muda o texto da tela de erro). */
  kind: ApiErrorKind | null
}

/**
 * Tela de erro de cada tipo de `ApiError`:
 * - sem internet ou falha de rede → "Sem conexão"
 * - API indisponível/limite (503, 429...), acesso recusado (bloqueio sem CORS), HTML no lugar
 *   de JSON ("Page temporarily unavailable") ou outro erro HTTP → "Erro no servidor"
 * Outros erros (ex.: abort da requisição) não levam a tela nenhuma.
 */
export function errorRoute(err: unknown): ErrorRoute | null {
  if (!(err instanceof ApiError)) return null
  switch (err.kind) {
    case 'offline':
    case 'network':
      return '/sem-conexao'
    case 'unavailable':
    case 'blocked':
    case 'invalid-response':
    case 'http':
      return '/erro'
  }
}
