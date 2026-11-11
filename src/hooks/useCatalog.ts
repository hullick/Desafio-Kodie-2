import { useEffect, useState } from 'react'
import { HOME_CATALOG_TAGS, HOME_FETCH_SIZE } from '../config/categories'
import type { Product } from '../models/Product'
import { getCatalog, peekCatalog } from '../services/openFoodFacts'

/**
 * Catálogo base da Home (o mesmo cache de 15 min). Em cache → na hora, sem requisição;
 * senão, uma busca, que a Home reaproveita depois. `null` enquanto carrega ou se falhar —
 * quem usa trata como "sem sugestões", sem tela de erro.
 */
export function useCatalog(): Product[] | null {
  const [products, setProducts] = useState<Product[] | null>(() => peekCatalog(HOME_CATALOG_TAGS, HOME_FETCH_SIZE) ?? null)
  const missing = products === null

  useEffect(() => {
    if (!missing) return
    const controller = new AbortController()
    getCatalog(HOME_CATALOG_TAGS, HOME_FETCH_SIZE, { signal: controller.signal }).then(
      (page) => !controller.signal.aborted && setProducts(page.products),
      () => {
        /* sem catálogo: sem sugestões */
      },
    )
    return () => controller.abort()
  }, [missing])

  return products
}
