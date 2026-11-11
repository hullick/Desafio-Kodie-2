/** Configuração do acesso à Open Food Facts (ver SPEC, seção 7). */
export const OFF_BASE_URL = 'https://world.openfoodfacts.org'

/** País aplicado por padrão em toda busca/listagem (`null` desliga o filtro). */
export const DEFAULT_COUNTRY = 'brazil'

/** Limites oficiais: 15 leituras/min e 10 buscas/min por IP. Usamos margem. */
export const PRODUCT_RATE = { max: 12, windowMs: 60_000 }
export const SEARCH_RATE = { max: 8, windowMs: 60_000 }

/** Novas tentativas para 503/502/504/429 ou resposta não-JSON, com espera crescente. */
export const RETRY_DELAYS_MS = [3_000, 8_000]

/** Validade do cache de respostas. */
export const CACHE_TTL_MS = 15 * 60_000

export const DEFAULT_PAGE_SIZE = 24
