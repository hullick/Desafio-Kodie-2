import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type StatusTone = 'neutral' | 'success' | 'warning' | 'error' | 'brand' | 'inverse'
/** soft → fundo claro · solid → fundo forte · text → só cor e ícone, sem fundo. */
export type StatusVariant = 'soft' | 'solid' | 'text'

export type StatusPillProps = {
  tone?: StatusTone
  variant?: StatusVariant
  shape?: 'pill' | 'rounded'
  icon?: string
  /** Ponto colorido antes do texto (pisca com `pulse`). */
  dot?: boolean
  pulse?: boolean
  uppercase?: boolean
  className?: string
  children: ReactNode
}

const DOT: Record<StatusTone, string> = {
  neutral: 'bg-outline',
  success: 'bg-primary',
  warning: 'bg-warning',
  error: 'bg-error',
  brand: 'bg-primary',
  inverse: 'bg-inverse-primary',
}

const SOFT: Record<StatusTone, string> = {
  neutral: 'bg-surface-container-high text-on-surface-variant',
  success: 'bg-secondary-container text-on-secondary-container',
  warning: 'bg-warning-container text-on-warning-container',
  error: 'bg-error-container text-on-error-container',
  brand: 'bg-primary/10 text-primary',
  inverse: 'bg-primary/30 text-inverse-primary',
}

const SOLID: Record<StatusTone, string> = {
  neutral: 'bg-inverse-surface text-inverse-on-surface',
  success: 'bg-primary text-on-primary',
  warning: 'bg-warning text-on-surface',
  error: 'bg-error text-on-error',
  brand: 'bg-primary text-on-primary',
  inverse: 'bg-inverse-surface text-inverse-on-surface',
}

const TEXT: Record<StatusTone, string> = {
  neutral: 'text-outline',
  success: 'text-primary',
  warning: 'text-on-warning-container',
  error: 'text-error',
  brand: 'text-primary',
  inverse: 'text-inverse-primary',
}

/** Indicadores de status: "Alto teor de açúcar", "Excelente escolha", "Operando", "Vencedor"... */
export function StatusPill({
  tone = 'neutral',
  variant = 'soft',
  shape = 'rounded',
  icon,
  dot = false,
  pulse = false,
  uppercase = false,
  className,
  children,
}: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-label-sm',
        variant !== 'text' && 'px-2 py-0.5',
        variant !== 'text' && (shape === 'pill' ? 'rounded-full' : 'rounded-md'),
        variant === 'soft' && SOFT[tone],
        variant === 'solid' && cn(SOLID[tone], 'font-bold shadow-sm'),
        variant === 'text' && cn(TEXT[tone], 'text-body-sm'),
        uppercase && 'tracking-wider uppercase',
        className,
      )}
    >
      {dot && (
        <span className="relative flex h-2 w-2" aria-hidden>
          {pulse && <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', DOT[tone])} />}
          <span className={cn('relative inline-flex h-2 w-2 rounded-full', DOT[tone])} />
        </span>
      )}
      {icon && <Icon name={icon} size={variant === 'text' ? 16 : 14} />}
      {children}
    </span>
  )
}
