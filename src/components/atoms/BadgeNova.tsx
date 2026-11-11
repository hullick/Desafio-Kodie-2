import { cn } from '../../lib/cn'
import { NOVA_LABEL } from '../../lib/nutritionStyles'
import type { NovaGroup } from '../../types/nutrition'

const PILL: Record<NovaGroup, string> = {
  1: 'bg-secondary-container text-on-secondary-container',
  2: 'bg-warning-container text-on-warning-container',
  3: 'bg-surface-container-high text-on-surface-variant',
  4: 'bg-error-container text-on-error-container',
}

const SOLID: Record<NovaGroup, string> = {
  1: 'bg-nova-1',
  2: 'bg-nova-2',
  3: 'bg-nova-3',
  4: 'bg-nova-4',
}

/**
 * pill   → "• NOVA 1 · In natura"
 * square → número em quadrado colorido (filtros)
 * block  → bloco grande "4 / NOVA" (detalhe do produto)
 */
export type BadgeNovaProps = {
  group: NovaGroup
  variant?: 'pill' | 'square' | 'block'
  className?: string
}

export function BadgeNova({ group, variant = 'pill', className }: BadgeNovaProps) {
  if (variant === 'block') {
    return (
      <span
        className={cn(
          'flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-white shadow-sm',
          SOLID[group],
          className,
        )}
        aria-label={`NOVA ${group}`}
      >
        <span className="text-headline-lg leading-none font-extrabold">{group}</span>
        <span className="text-[9px] font-bold tracking-wider uppercase">NOVA</span>
      </span>
    )
  }

  if (variant === 'square') {
    return (
      <span
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-label-sm text-white',
          SOLID[group],
          className,
        )}
        aria-label={`NOVA ${group}`}
      >
        {group}
      </span>
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-lg px-2 py-0.5', PILL[group], className)}>
      <span className={cn('h-2 w-2 rounded-full', SOLID[group])} aria-hidden />
      <span className="text-label-sm">
        NOVA {group} · {NOVA_LABEL[group]}
      </span>
    </span>
  )
}
