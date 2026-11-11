import type { ReactNode } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { Pagination, type PaginationProps } from '../molecules/Pagination'
import { ResultsToolbar } from '../molecules/ResultsToolbar'
import { ProductCard, type ProductCardProps } from './ProductCard'

export type ProductResultsProps = {
  products: Array<Omit<ProductCardProps, 'layout'> & { id: string }>
  total: number
  compareCount: number
  compareMax: number
  /** Ordenação mostrada na barra de resultados (desktop). */
  sort?: ReactNode
  pagination?: PaginationProps
  /** Conteúdo quando não há produtos (estado vazio). */
  empty?: ReactNode
}

/** Lista de resultados: barra de totais, cards (lista no mobile, grade no desktop) e paginação. */
export function ProductResults({ products, total, compareCount, compareMax, sort, pagination, empty }: ProductResultsProps) {
  const isGrid = useMediaQuery('(min-width: 768px)')

  return (
    <section aria-label="Resultados de alimentos encontrados" className="flex w-full flex-col gap-space-md">
      <div className="hidden md:block">
        <ResultsToolbar total={total} compareCount={compareCount} compareMax={compareMax} sort={sort} />
      </div>
      {products.length === 0 ? (
        empty
      ) : (
        <div className="flex flex-col gap-space-md md:grid md:grid-cols-2 md:gap-gutter-md xl:grid-cols-3">
          {products.map(({ id, ...card }) => (
            <ProductCard key={id} {...card} layout={isGrid ? 'column' : 'row'} />
          ))}
        </div>
      )}
      {pagination && <Pagination {...pagination} />}
    </section>
  )
}
