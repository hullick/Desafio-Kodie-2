import { cn } from '../../lib/cn'

export type CountBadgeProps = {
  /** Sem `count`, mostra só um ponto de alerta. */
  count?: number
  tone?: 'error' | 'primary'
  className?: string
  label?: string
}

/** Contador sobre ícones (ex.: itens no comparador, notificações). Posicione pelo pai. */
export function CountBadge({ count, tone = 'error', className, label }: CountBadgeProps) {
  const color = tone === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'
  if (count === undefined) {
    return <span className={cn('block h-2 w-2 rounded-full', color, className)} aria-label={label} />
  }
  return (
    <span
      className={cn('rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold', color, className)}
      aria-label={label}
    >
      {count}
    </span>
  )
}
