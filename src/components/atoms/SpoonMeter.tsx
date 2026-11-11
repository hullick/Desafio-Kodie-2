import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type SpoonMeterProps = {
  /** Quantidade de colheres de chá (aceita frações, ex.: 6.5). */
  spoons: number
  /** Máximo de ícones desenhados antes de resumir com "+N". */
  maxIcons?: number
  className?: string
}

/** Representa açúcar em colheres de chá (ícones cheios + meia colher). */
export function SpoonMeter({ spoons, maxIcons = 12, className }: SpoonMeterProps) {
  const full = Math.floor(spoons)
  const half = spoons - full >= 0.25
  const drawn = Math.min(full, maxIcons)
  const extra = full - drawn

  return (
    <div
      role="img"
      aria-label={`${spoons.toLocaleString('pt-BR')} colheres de chá`}
      className={cn('grid grid-cols-4 gap-1.5 text-error', className)}
    >
      {Array.from({ length: drawn }, (_, i) => (
        <Icon key={i} name="nutrition" filled size={20} />
      ))}
      {extra > 0 && <span className="flex items-center justify-center text-label-sm font-bold text-on-surface-variant">+{extra}</span>}
      {half && <span className="flex items-center justify-center text-label-sm font-bold text-on-surface-variant">+½</span>}
    </div>
  )
}
