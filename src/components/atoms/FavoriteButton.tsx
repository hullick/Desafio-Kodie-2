import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type FavoriteButtonProps = {
  active: boolean
  onToggle: () => void
  /** Nome do produto, usado no rótulo acessível. */
  productName: string
  /** plain → só o coração · filled → coração em círculo com fundo. */
  variant?: 'plain' | 'filled'
  className?: string
}

export function FavoriteButton({ active, onToggle, productName, variant = 'plain', className }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? `Remover ${productName} dos favoritos` : `Favoritar ${productName}`}
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        variant === 'filled'
          ? active
            ? 'bg-surface-container-low text-error hover:bg-error-container'
            : 'bg-surface-container-low text-outline hover:bg-surface-container hover:text-error'
          : active
            ? 'text-error'
            : 'text-outline hover:text-error',
        className,
      )}
    >
      <Icon name={variant === 'plain' && !active ? 'favorite_border' : 'favorite'} filled={active} size={variant === 'filled' ? 18 : 22} />
    </button>
  )
}
