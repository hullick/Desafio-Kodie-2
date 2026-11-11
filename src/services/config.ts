/** Configuração do acesso à Open Food Facts (ver SPEC, seção 7). */

/**
 * Endereço da API, sem barra final. Vem sempre de VITE_OFF_BASE_URL (arquivos .env por modo ou
 * variável do deploy; ver .env.example) — o vite.config.ts recusa iniciar sem ela.
 * - produção: https://world.openfoodfacts.org
 * - desenvolvimento e testes: https://world.openfoodfacts.net (ambiente de testes, cota de
 *   requisições separada da produção: testar não bloqueia o IP na API real)
 */
export const OFF_BASE_URL = import.meta.env.VITE_OFF_BASE_URL.trim().replace(/\/+$/, '')

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
