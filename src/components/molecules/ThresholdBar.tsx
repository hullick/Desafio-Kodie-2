import { useId } from 'react'
import { cn } from '../../lib/cn'

export type ThresholdBarProps = {
  label: string
  /** Unidade do limite (ex.: "g", "mg"). */
  unit: string
  min: number
  max: number
  step: number
  /** Limite atual (por 100 g/ml). */
  value: number
  /** Desativado → cinza, "Qualquer teor" e sem limite aplicado. */
  enabled: boolean
  onChange: (value: number) => void
  onToggle: (enabled: boolean) => void
}

const decimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

/** Limiar nutricional: liga/desliga, valor máximo e controle deslizante. */
export function ThresholdBar({ label, unit, min, max, step, value, enabled, onChange, onToggle }: ThresholdBarProps) {
  const id = useId()
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2 text-label-sm text-on-surface-variant">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded accent-primary"
          />
          {label}
        </label>
        <output htmlFor={id} className={cn('font-bold', enabled ? 'text-primary' : 'text-outline')}>
          {enabled ? `≤ ${decimal.format(value)}${unit} / 100g` : 'Qualquer teor'}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={!enabled}
        aria-label={`Limite de ${label.toLowerCase()} por 100 g`}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn('h-2 w-full cursor-pointer accent-primary', !enabled && 'cursor-not-allowed opacity-40 grayscale')}
      />
    </div>
  )
}
