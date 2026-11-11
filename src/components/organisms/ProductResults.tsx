import type { ReactNode } from 'react'
import { Pagination, type PaginationProps } from '../molecules/Pagination'
import { ResultsToolbar } from '../molecules/ResultsToolbar'
import { ProductGrid, type ProductGridItem } from './ProductGrid'

export type ProductResultsProps = {
  products: ProductGridItem[]
  total: number
  compareCount: number
  compareMax: number
  /** Ordenação mostrada na barra de resultados (desktop). */
  sort?: ReactNode
  pagination?: PaginationProps
  /** Conteúdo quando não há produtos (estado vazio). */
  empty?: ReactNode
}

/** Resultados da busca: barra de totais, grade de cards e paginação. */
export function ProductResults({ products, total, compareCount, compareMax, sort, pagination, empty }: ProductResultsProps) {
  return (
    <section aria-label="Resultados de alimentos encontrados" className="flex w-full flex-col gap-space-md">
      <div className="hidden md:block">
        <ResultsToolbar total={total} compareCount={compareCount} compareMax={compareMax} sort={sort} />
      </div>
      {products.length === 0 ? empty : <ProductGrid products={products} />}
      {pagination && <Pagination {...pagination} />}
    </section>
  )
}
