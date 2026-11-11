import { useEffect, useState } from 'react'
import { HOME_CATALOG_TAGS, HOME_FETCH_SIZE } from '../config/categories'
import type { SearchPage } from '../models/SearchPage'
import { getCatalog, searchProducts } from '../services/openFoodFacts'
import { useApiErrorRedirect } from './useApiErrorRedirect'

export type ProductSearchState =
  | { status: 'loading' }
  | { status: 'success'; page: SearchPage }
  | { status: 'error'; error: unknown }

type Result = { term: string; page?: SearchPage; error?: unknown }

/**
 * Produtos da Home: sem texto → catálogo base (uma requisição, em cache por 15 min);
 * com texto → busca na Open Food Facts (só quando a pessoa busca explicitamente).
 * Nos dois casos vêm até HOME_FETCH_SIZE produtos; filtrar e ordenar fica com a página.
 * Erros da API levam à tela de erro correspondente.
 */
export function useProductSearch(term: string): ProductSearchState {
  const [result, setResult] = useState<Result | null>(null)
  const redirectOnError = useApiErrorRedirect()

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const request = term
      ? searchProducts({ query: term, pageSize: HOME_FETCH_SIZE }, { signal })
      : getCatalog(HOME_CATALOG_TAGS, HOME_FETCH_SIZE, { signal })
    request.then(
      (page) => setResult({ term, page }),
      (error: unknown) => {
        if (signal.aborted) return
        if (!redirectOnError(error)) setResult({ term, error })
      },
    )
    return () => controller.abort()
  }, [term, redirectOnError])

  // Resultado de outro termo ainda na tela → a busca atual está carregando.
  if (!result || result.term !== term) return { status: 'loading' }
  if (result.page) return { status: 'success', page: result.page }
  return { status: 'error', error: result.error }
}
