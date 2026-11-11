import { cn } from '../../lib/cn'
import type { ComparedProduct } from '../../types/comparison'
import { CompareProductCard } from '../molecules/CompareProductCard'

export type ComparisonDuelCarouselProps = {
  products: ComparedProduct[]
  onRemove: (id: string) => void
  onSwap?: (id: string) => void
}

/** Uma coluna por produto (classes fixas para o Tailwind encontrar). */
const COLUMNS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
}

/**
 * Produtos em duelo, todos visíveis lado a lado: cada um ocupa 1/n da largura (2 → metade,
 * 3 → um terço, 4 → um quarto). O card se compacta sozinho quando fica estreito.
 */
export function ComparisonDuelCarousel({ products, onRemove, onSwap }: ComparisonDuelCarouselProps) {
  return (
    <div className={cn('grid gap-space-xs md:gap-space-sm lg:gap-gutter-md', COLUMNS[products.length] ?? 'grid-cols-5')}>
      {products.map((p) => (
        <CompareProductCard key={p.id} product={p} onRemove={() => onRemove(p.id)} onSwap={onSwap ? () => onSwap(p.id) : undefined} />
      ))}
    </div>
  )
}
