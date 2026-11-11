import { cn } from '../../lib/cn'
import type { NutrientLevel } from '../../types/nutrition'

export type NutrientTileProps = {
  label: string
  /** Valor já formatado (ex.: "4,5g"). Sem valor → "Não informado". */
  value?: string
  level?: NutrientLevel
  /** Nota abaixo do valor (ex.: "/100g", "rótulo parcial"). */
  note?: string
  /** tile → bloco com fundo e ponto de nível (mobile) · inline → texto simples (desktop). */
  variant?: 'tile' | 'inline'
}

const VALUE_COLOR: Record<NutrientLevel, string> = {
  low: 'text-primary',
  moderate: 'text-on-warning-container',
  high: 'text-error',
}

const DOT_COLOR: Record<NutrientLevel, string> = {
  low: 'bg-primary',
  moderate: 'bg-nutri-c',
  high: 'bg-error',
}

/** Teor de um nutriente com cor conforme o nível (baixo, moderado, alto). */
export function NutrientTile({ label, value, level, note, variant = 'tile' }: NutrientTileProps) {
  const high = level === 'high'

  if (variant === 'inline') {
    return (
      <div className="text-center">
        <span className="block text-label-sm text-outline">{label}</span>
        <span className={cn('text-label-md font-semibold', level ? VALUE_COLOR[level] : 'text-on-surface')}>
          {value ?? '—'}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl p-2 text-center',
        high ? 'bg-error-container/30' : 'bg-surface-container-low',
      )}
    >
      <span className={cn('text-[10px] uppercase', high ? 'font-bold text-error' : 'text-outline')}>{label}</span>
      {value ? (
        <span className={cn('text-label-md font-bold', level ? VALUE_COLOR[level] : 'text-on-surface')}>{value}</span>
      ) : (
        <span className="text-[12px] text-outline italic">Não informado</span>
      )}
      {level && value && <span className={cn('mt-1 h-1.5 w-1.5 rounded-full', DOT_COLOR[level])} aria-hidden />}
      {note && <span className="mt-0.5 text-[9px] text-outline">{note}</span>}
    </div>
  )
}
