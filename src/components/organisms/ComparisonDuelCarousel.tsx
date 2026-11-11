import type { ComparedProduct } from '../../types/comparison'
import { CompareProductCard } from '../molecules/CompareProductCard'

export type ComparisonDuelCarouselProps = {
  products: ComparedProduct[]
  onRemove: (id: string) => void
  onSwap?: (id: string) => void
}

/**
 * Produtos em duelo.
 * Mobile: carrossel horizontal com scroll snap. Desktop: grade de até 3 colunas (5 itens quebram linha).
 */
export function ComparisonDuelCarousel({ products, onRemove, onSwap }: ComparisonDuelCarouselProps) {
  return (
    <div className="-mx-gutter flex snap-x snap-mandatory gap-space-sm overflow-x-auto scroll-smooth px-gutter pb-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-gutter-md lg:overflow-visible lg:px-0">
      {products.map((p) => (
        <CompareProductCard key={p.id} product={p} onRemove={() => onRemove(p.id)} onSwap={onSwap ? () => onSwap(p.id) : undefined} />
      ))}
    </div>
  )
}
