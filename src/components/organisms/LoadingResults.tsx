import { useMediaQuery } from '../../hooks/useMediaQuery'
import { Icon } from '../atoms/Icon'
import { ProductCardSkeleton } from '../molecules/ProductCardSkeleton'

export type LoadingResultsProps = {
  /** Quantos cards de placeholder mostrar. */
  count?: number
  message?: string
}

/** Estado de carregamento da lista: cards-esqueleto no formato da grade e mensagem com ícone girando. */
export function LoadingResults({ count = 3, message = 'Carregando produtos...' }: LoadingResultsProps) {
  const isGrid = useMediaQuery('(min-width: 768px)')
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="flex flex-col gap-space-md">
      <div className="flex flex-col gap-space-md md:grid md:grid-cols-2 md:gap-gutter-md xl:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <ProductCardSkeleton key={i} layout={isGrid ? 'column' : 'row'} />
        ))}
      </div>
      <p className="flex items-center justify-center gap-space-xs py-space-sm text-label-md text-secondary">
        <Icon name="sync" size={18} className="animate-spin" /> {message}
      </p>
    </div>
  )
}
