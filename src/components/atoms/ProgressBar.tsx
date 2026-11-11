import { cn } from '../../lib/cn'

export type ProgressTone = 'primary' | 'outline' | 'warning' | 'error'

export type ProgressBarProps = {
  /** Percentual de 0 a 100 (valores fora da faixa são limitados). */
  value: number
  tone?: ProgressTone
  size?: 'sm' | 'md'
  label?: string
  className?: string
}

const TONES: Record<ProgressTone, string> = {
  primary: 'bg-primary',
  outline: 'bg-outline',
  warning: 'bg-nutri-c',
  error: 'bg-error',
}

/** Barra de percentual para teores (açúcar, fibras, sódio, calorias). */
export function ProgressBar({ value, tone = 'primary', size = 'md', label, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
      className={cn(
        'w-full overflow-hidden rounded-full bg-surface-container-high',
        size === 'md' ? 'h-2' : 'h-1.5',
        className,
      )}
    >
      <div className={cn('h-full rounded-full transition-[width]', TONES[tone])} style={{ width: `${pct}%` }} />
    </div>
  )
}
