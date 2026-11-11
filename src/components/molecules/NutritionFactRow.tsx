import { cn } from '../../lib/cn'
import type { NutrientLevel } from '../../types/nutrition'

export type NutritionFactRowProps = {
  label: string
  /** Valor formatado (ex.: "32,0 g"). */
  value: string
  /** Valor secundário (ex.: "(330 mg)"). */
  secondary?: string
  /** Explicação curta (ex.: "64% do limite recomendado"). */
  description?: string
  level?: NutrientLevel | 'neutral'
}

const STYLE: Record<NutrientLevel | 'neutral', { row: string; dot: string; value: string; pill: string; text: string }> = {
  high: {
    row: 'bg-error-container/30',
    dot: 'bg-error',
    value: 'text-error font-black',
    pill: 'bg-error text-on-error',
    text: 'Alto',
  },
  moderate: {
    row: 'bg-warning-container/50',
    dot: 'bg-warning',
    value: 'text-on-surface font-bold',
    pill: 'bg-warning-container text-on-warning-container',
    text: 'Moderado',
  },
  low: {
    row: 'bg-secondary-container/40',
    dot: 'bg-primary',
    value: 'text-primary font-bold',
    pill: 'bg-primary-container text-on-primary',
    text: 'Baixo',
  },
  neutral: {
    row: 'bg-surface-container-low',
    dot: 'bg-outline',
    value: 'text-on-surface font-semibold',
    pill: 'bg-surface-container-high text-on-surface',
    text: 'Regular',
  },
}

/** Linha da tabela nutricional com cor e selo de nível. */
export function NutritionFactRow({ label, value, secondary, description, level = 'neutral' }: NutritionFactRowProps) {
  const s = STYLE[level]
  return (
    <div className={cn('flex items-center justify-between gap-3 rounded-xl p-3 lg:p-space-md', s.row)}>
      <div className="flex min-w-0 items-center gap-space-sm lg:gap-space-md">
        <span className={cn('h-3 w-3 shrink-0 rounded-full lg:h-3.5 lg:w-3.5', s.dot)} aria-hidden />
        <div className="min-w-0">
          <p className="text-label-lg font-bold text-on-surface">{label}</p>
          {description && <p className="text-body-sm text-on-surface-variant">{description}</p>}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <span className={cn('text-headline-sm', s.value)}>
          {value}
          {secondary && <span className="ml-1 text-body-sm font-normal text-outline">{secondary}</span>}
        </span>
        <span className={cn('block rounded-full px-2 py-0.5 text-center text-label-sm', s.pill)}>{s.text}</span>
      </div>
    </div>
  )
}
