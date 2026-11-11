import { cn } from '../../lib/cn'
import { ProgressBar } from '../atoms/ProgressBar'

export type ThresholdBarProps = {
  label: string
  /** Limite formatado (ex.: "≤ 5g / 100g", "Qualquer teor"). */
  valueLabel: string
  percent: number
  /** Desativado → cinza (sem limite aplicado). */
  active?: boolean
}

/** Linha de limiar nutricional: rótulo, valor e barra. */
export function ThresholdBar({ label, valueLabel, percent, active = true }: ThresholdBarProps) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-label-sm text-on-surface-variant">
        <span>{label}</span>
        <span className={cn('font-bold', active ? 'text-primary' : 'text-outline')}>{valueLabel}</span>
      </div>
      <ProgressBar value={percent} tone={active ? 'primary' : 'outline'} label={label} />
    </div>
  )
}
