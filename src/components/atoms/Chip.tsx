import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  selected?: boolean
  /** Elemento à esquerda (ex.: badge de Nutri-Score). */
  leading?: ReactNode
  /** Mostra um "check" quando selecionado. */
  showCheck?: boolean
  /** Fundo quando não selecionado: card branco ou superfície neutra. */
  tone?: 'card' | 'muted'
  /** Cor quando selecionado. */
  selectedTone?: 'secondary' | 'primary'
  shape?: 'pill' | 'rounded'
  size?: 'sm' | 'md'
  children: ReactNode
}

/** Chip de filtro, sugestão ou ordenação. */
export function Chip({
  selected = false,
  leading,
  showCheck = false,
  tone = 'card',
  selectedTone = 'secondary',
  shape = 'pill',
  size = 'md',
  className,
  children,
  ...rest
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'flex shrink-0 items-center gap-1.5 whitespace-nowrap transition-all active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        size === 'md' ? 'h-9 px-3 text-label-md' : 'px-3 py-1 text-label-sm',
        shape === 'pill' ? 'rounded-full' : 'rounded-xl',
        selected
          ? selectedTone === 'primary'
            ? 'bg-primary text-on-primary shadow-sm'
            : 'bg-secondary-container text-on-secondary-container shadow-sm'
          : tone === 'card'
            ? 'bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-low'
            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container',
        className,
      )}
      {...rest}
    >
      {selected && showCheck && <Icon name="check" size={16} />}
      {leading}
      {children}
    </button>
  )
}
