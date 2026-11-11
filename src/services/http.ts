import { ApiError } from './ApiError'
import { OFF_BASE_URL, RETRY_DELAYS_MS } from './config'
import { sleep, type RateLimiter } from './RateLimiter'

/** Status em que a API pede para esperar (sobrecarga ou limite). */
const RETRY_STATUS = new Set([429, 502, 503, 504])

export type GetJsonOptions = {
  limiter: RateLimiter
  signal?: AbortSignal
  /** Status de erro que ainda trazem JSON útil (ex.: 404 da v3 para produto inexistente). */
  acceptStatus?: number[]
}

/** Espera do `Retry-After` (em segundos) se vier, senão a da tabela. */
function retryDelay(res: Response | null, attempt: number): number {
  const header = Number(res?.headers.get('Retry-After'))
  return Number.isFinite(header) && header > 0 ? header * 1000 : RETRY_DELAYS_MS[attempt]
}

/** Arquivo estático pequeno do servidor da API, usado só para sondar se ele está acessível. */
const PROBE_URL = `${OFF_BASE_URL}/favicon.ico`

/**
 * O `fetch` falhou com o aparelho online: foi a rede ou o servidor recusou?
 * Quando a Open Food Facts bloqueia (limite/anti-robô), ela responde 503 sem cabeçalho CORS,
 * e o navegador transforma isso no mesmo TypeError de uma falha de rede, sem expor o status.
 * Uma requisição `no-cors` não é barrada pelo CORS: se ela chega ao servidor, há rede e a falha
 * anterior foi recusa. `no-store` evita que um favicon em cache finja que o servidor respondeu.
 */
async function serverReachable(signal?: AbortSignal): Promise<boolean> {
  try {
    await fetch(PROBE_URL, { mode: 'no-cors', cache: 'no-store', signal })
    return true
  } catch {
    return false
  }
}

/**
 * GET de JSON com limitador, novas tentativas e erros tipados.
 * Bloqueio da API não é repetido: novas tentativas só aumentariam o tempo de bloqueio.
 * Cada tentativa passa pelo limitador (também conta no limite da API).
 */
export async function getJson<T>(url: string, { limiter, signal, acceptStatus = [] }: GetJsonOptions): Promise<T> {
  let lastError: ApiError = new ApiError('network', 'Falha ao acessar a Open Food Facts.')

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    await limiter.acquire(signal)

    let res: Response | null = null
    try {
      res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    } catch (err) {
      if (signal?.aborted) throw err
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new ApiError('offline', 'Sem conexão com a internet.')
      }
      if (await serverReachable(signal)) {
        throw new ApiError('blocked', 'A Open Food Facts limitou o acesso temporariamente.')
      }
      if (signal?.aborted) throw err
      lastError = new ApiError('network', 'Falha de rede ao acessar a Open Food Facts.')
    }

    if (res) {
      if (RETRY_STATUS.has(res.status)) {
        lastError = new ApiError('unavailable', 'A Open Food Facts está temporariamente indisponível.', res.status)
      } else if (!res.ok && !acceptStatus.includes(res.status)) {
        throw new ApiError('http', `A Open Food Facts respondeu com erro ${res.status}.`, res.status)
      } else {
        try {
          return (await res.json()) as T
        } catch {
          // Ex.: página HTML de manutenção servida com status 200.
          lastError = new ApiError('invalid-response', 'Resposta inesperada da Open Food Facts.', res.status)
        }
      }
    }

    if (attempt < RETRY_DELAYS_MS.length) await sleep(retryDelay(res, attempt), signal)
  }

  throw lastError
}
