import { cn } from '../../lib/cn'

export type RingGaugeProps = {
  /** Percentual de 0 a 100. */
  value: number
  label: string
  tone?: 'error' | 'primary' | 'warning'
  size?: number
  className?: string
}

const STROKE = { error: 'stroke-error', primary: 'stroke-primary', warning: 'stroke-nutri-c' }
const TEXT = { error: 'text-error', primary: 'text-primary', warning: 'text-on-warning-container' }

/** Anel de percentual (ex.: "32% Açúcar"). */
export function RingGauge({ value, label, tone = 'error', size = 112, className }: RingGaugeProps) {
  const pct = Math.max(0, Math.min(100, value))
  const r = 42
  const circ = 2 * Math.PI * r
  return (
    <div
      role="img"
      aria-label={`${Math.round(pct)}% ${label}`}
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="10" className="stroke-surface-container-high" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct / 100)}
          className={STROKE[tone]}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={cn('text-headline-lg leading-none font-black', TEXT[tone])}>{Math.round(pct)}%</span>
        <span className="text-label-sm tracking-wider text-outline uppercase">{label}</span>
      </div>
    </div>
  )
}
