import { cn } from '../../lib/cn'
import type { CompareTone } from '../../types/comparison'
import { ProgressBar } from '../atoms/ProgressBar'

export type NutrientMetricBarProps = {
  /** Nome curto do produto. */
  label: string
  /** Valor absoluto formatado (ex.: "0,8g"). */
  value: string
  /** Largura da barra em % (relativa ao maior valor do grupo). Sem valor, não desenha barra. */
  percent?: number
  tone?: CompareTone
  /** Tag de status abaixo da barra (ex.: "Sem açúcar", "Alto açúcar"). */
  note?: string
}

const TEXT: Record<CompareTone, string> = {
  best: 'text-primary font-extrabold',
  worst: 'text-error font-extrabold',
  neutral: 'text-on-surface font-bold',
}

/** Barra comparativa de um produto: rótulo, valor, barra e tag de status. */
export function NutrientMetricBar({ label, value, percent, tone = 'neutral', note }: NutrientMetricBarProps) {
  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-1 flex items-baseline justify-between gap-1">
        <span className={cn('truncate text-[10px] lg:text-body-sm', tone === 'best' ? 'font-semibold text-primary' : 'text-on-surface-variant')}>{label}</span>
        <span className={cn('text-[12px] lg:text-label-lg', TEXT[tone])}>{value}</span>
      </div>
      {percent !== undefined && (
        <ProgressBar value={percent} tone={tone === 'best' ? 'primary' : tone === 'worst' ? 'error' : 'outline'} label={`${label}: ${value}`} className="h-2.5" />
      )}
      {note && (
        <span className={cn('mt-1 truncate text-[9px] lg:text-label-sm', tone === 'best' ? 'font-bold text-primary' : tone === 'worst' ? 'font-bold text-error' : 'text-on-surface-variant')}>
          {note}
        </span>
      )}
    </div>
  )
}
