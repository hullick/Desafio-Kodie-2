import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from '../atoms/Icon'

export type TipCardProps = {
  title: string
  children: ReactNode
  icon?: string
  /**
   * row     → ícone redondo à esquerda (mobile)
   * stacked → título com ícone e fundo decorativo (barra lateral)
   * insight → card branco de análise (ex.: "Controle Glicêmico" no veredito)
   */
  variant?: 'row' | 'stacked' | 'insight'
  className?: string
}

/** Dica ou ponto de análise com ícone, título e texto. */
export function TipCard({ title, children, icon = 'lightbulb', variant = 'row', className }: TipCardProps) {
  if (variant === 'insight') {
    return (
      <div className={cn('rounded-xl bg-surface-container-lowest p-space-md shadow-sm', className)}>
        <h4 className="mb-1.5 flex items-center gap-2 text-label-lg font-bold text-primary">
          <Icon name={icon} size={20} />
          {title}
        </h4>
        <p className="text-body-md text-on-surface-variant">{children}</p>
      </div>
    )
  }

  if (variant === 'stacked') {
    return (
      <aside className={cn('relative overflow-hidden rounded-2xl bg-surface-container-low p-4', className)}>
        <span className="pointer-events-none absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-primary/10" aria-hidden />
        <h3 className="mb-1 flex items-center gap-2 text-label-md text-primary">
          <Icon name={icon} size={18} />
          {title}
        </h3>
        <p className="text-body-sm text-on-surface-variant">{children}</p>
      </aside>
    )
  }

  return (
    <aside className={cn('flex items-center gap-3 rounded-2xl bg-surface-container-low p-4', className)}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
        <Icon name={icon} size={22} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-label-md font-bold text-on-surface">{title}</h3>
        <p className="text-body-sm text-on-surface-variant">{children}</p>
      </div>
    </aside>
  )
}
