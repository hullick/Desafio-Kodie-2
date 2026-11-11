import { useEffect, useState } from 'react'
import type { Product } from '../models/Product'
import { getProductsByCodes } from '../services/openFoodFacts'
import { useApiErrorRedirect } from './useApiErrorRedirect'

export type CompareProductsState =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  /** Na ordem pedida; códigos que não existem na API ficam de fora. */
  | { status: 'success'; products: Product[] }

type Result = { key: string; products?: Product[]; error?: unknown }

/**
 * Produtos do comparador: uma busca só (`code=a,b,c`) e só dos que não estão em cache —
 * os que vieram da Home ou dos detalhes não gastam requisição. Erros da API levam à tela de erro.
 */
export function useCompareProducts(codes: string[]): CompareProductsState {
  const key = codes.join(',')
  const [result, setResult] = useState<Result | null>(null)
  const redirectOnError = useApiErrorRedirect()

  useEffect(() => {
    if (!key) return
    const controller = new AbortController()
    const { signal } = controller
    getProductsByCodes(key.split(','), { signal }).then(
      (products) => !signal.aborted && setResult({ key, products }),
      (error: unknown) => {
        if (signal.aborted) return
        if (!redirectOnError(error)) setResult({ key, error })
      },
    )
    return () => controller.abort()
  }, [key, redirectOnError])

  if (!key) return { status: 'success', products: [] }
  // Resultado de outra seleção ainda na tela → a atual está carregando.
  if (!result || result.key !== key) return { status: 'loading' }
  if (result.products) return { status: 'success', products: result.products }
  return { status: 'error', error: result.error }
}
