import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type CartButtonProps = {
  active: boolean
  onToggle: () => void
  /** Nome do produto, usado no rótulo acessível. */
  productName: string
  /** plain → só o carrinho · filled → carrinho em círculo com fundo (mesmos formatos do FavoriteButton). */
  variant?: 'plain' | 'filled'
  className?: string
}

/** Põe o produto no checklist de mercado ou tira dele. */
export function CartButton({ active, onToggle, productName, variant = 'plain', className }: CartButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? `Tirar ${productName} do checklist de mercado` : `Adicionar ${productName} ao checklist de mercado`}
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        variant === 'filled'
          ? active
            ? 'bg-secondary-container text-primary'
            : 'bg-surface-container-low text-outline hover:bg-surface-container hover:text-primary'
          : active
            ? 'text-primary'
            : 'text-outline hover:text-primary',
        className,
      )}
    >
      <Icon name={active ? 'shopping_cart' : 'add_shopping_cart'} filled={active} size={variant === 'filled' ? 18 : 22} />
    </button>
  )
}
