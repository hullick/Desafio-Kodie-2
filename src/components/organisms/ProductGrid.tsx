import { useMediaQuery } from '../../hooks/useMediaQuery'
import { cn } from '../../lib/cn'
import { ProductCard, type ProductCardProps } from './ProductCard'

export type ProductGridItem = Omit<ProductCardProps, 'layout'> & { id: string }

export type ProductGridProps = {
  products: ProductGridItem[]
  /** auto → lista no mobile e grade a partir de 768px · list → sempre lista · grid → grade quando houver espaço. */
  view?: 'auto' | 'list' | 'grid'
  /** Colunas máximas da grade (3 na busca, 2 quando há barra lateral). */
  maxColumns?: 2 | 3
}

/** Grade responsiva de ProductCard (lista no mobile, grade no desktop). */
export function ProductGrid({ products, view = 'auto', maxColumns = 3 }: ProductGridProps) {
  const wide = useMediaQuery('(min-width: 768px)')
  const asGrid = view !== 'list' && wide

  return (
    <div
      className={cn(
        'flex flex-col gap-space-md',
        asGrid && 'md:grid md:grid-cols-2 md:gap-gutter-md',
        asGrid && maxColumns === 3 && 'xl:grid-cols-3',
      )}
    >
      {products.map(({ id, ...card }) => (
        <ProductCard key={id} {...card} layout={asGrid ? 'column' : 'row'} />
      ))}
    </div>
  )
}
