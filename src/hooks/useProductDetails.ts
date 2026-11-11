import { useEffect, useState } from 'react'
import { HOME_CATALOG_TAGS, HOME_FETCH_SIZE } from '../config/categories'
import type { Product } from '../models/Product'
import type { ProductLookup } from '../models/ProductLookup'
import { loadCategoryAliases, resolveLocalCategories } from '../i18n/categoryAliases'
import { getAlternatives, getProduct, peekCatalog } from '../services/openFoodFacts'
import { useApiErrorRedirect } from './useApiErrorRedirect'

export type ProductDetailsState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'error'; error: unknown }
  | { status: 'success'; product: Product; alternatives: AlternativesState }

/** Alternativas: `ready` com lista vazia = buscou e não há; `failed` = a busca falhou. */
export type AlternativesState = { status: 'loading' } | { status: 'failed' } | { status: 'ready'; list: Product[] }

type Result = { code: string; lookup?: ProductLookup; error?: unknown }

/**
 * Sem categoria da taxonomia (só texto solto, ex.: "pt:Bebida"), converte pelo nome antes de
 * buscar; sem conversão possível, não há alternativas.
 */
async function alternativesFor(product: Product, signal: AbortSignal): Promise<Product[]> {
  // Catálogo da Home em cache: se tiver alternativas suficientes, nenhuma busca é feita.
  const pool = peekCatalog(HOME_CATALOG_TAGS, HOME_FETCH_SIZE)
  if (product.categories.length > 0) return getAlternatives(product, { pool, signal })
  if (product.localCategories.length === 0) return []
  const categories = resolveLocalCategories(product, await loadCategoryAliases())
  return categories.length > 0 ? getAlternatives(product, { categories, pool, signal }) : []
}

/**
 * Produto da tela de detalhes (GET /api/v3/product, com cache) e, depois dele, as alternativas
 * mais saudáveis (catálogo em cache ou uma busca). Erro no produto leva à tela de erro; erro nas
 * alternativas fica em `alternatives.status` — a página do produto continua útil.
 */
export function useProductDetails(code: string): ProductDetailsState {
  const [result, setResult] = useState<Result | null>(null)
  const [alternatives, setAlternatives] = useState<{ code: string; state: AlternativesState } | null>(null)
  const redirectOnError = useApiErrorRedirect()

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    getProduct(code, { signal })
      .then((lookup) => {
        if (signal.aborted) return
        setResult({ code, lookup })
        const product = lookup.product
        if (!product) return
        alternativesFor(product, signal).then(
          (list) => !signal.aborted && setAlternatives({ code, state: { status: 'ready', list } }),
          () => !signal.aborted && setAlternatives({ code, state: { status: 'failed' } }),
        )
      })
      .catch((error: unknown) => {
        if (signal.aborted) return
        if (!redirectOnError(error)) setResult({ code, error })
      })
    return () => controller.abort()
  }, [code, redirectOnError])

  // Resultado de outro código ainda na tela → o atual está carregando.
  if (!result || result.code !== code) return { status: 'loading' }
  if (result.error !== undefined) return { status: 'error', error: result.error }
  const product = result.lookup?.product
  if (!product) return { status: 'not-found' }
  return {
    status: 'success',
    product,
    alternatives: alternatives?.code === code ? alternatives.state : { status: 'loading' },
  }
}
