import { cn } from '../../lib/cn'
import { NUTRI_BG, NUTRI_ON, NUTRI_TEXT } from '../../lib/nutritionStyles'
import type { NutriGrade } from '../../types/nutrition'
import { Icon } from './Icon'

/**
 * label  → "NUTRI-SCORE [A]" (cards mobile)
 * pill   → "Nutri-Score A" (cards desktop)
 * circle → letra em círculo (chips de filtro)
 */
export type BadgeNutriScoreVariant = 'label' | 'pill' | 'circle'

export type BadgeNutriScoreProps = {
  grade?: NutriGrade | null
  variant?: BadgeNutriScoreVariant
  className?: string
}

export function BadgeNutriScore({ grade, variant = 'label', className }: BadgeNutriScoreProps) {
  if (!grade) {
    if (variant === 'circle') {
      return (
        <span
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full bg-surface-container text-[12px] font-bold text-outline',
            className,
          )}
          aria-label="Nutri-Score não avaliado"
        >
          ?
        </span>
      )
    }
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-lg bg-surface-container px-2.5 py-0.5 text-label-sm text-on-surface-variant',
          className,
        )}
      >
        <Icon name="help_outline" size={15} className="text-outline" />
        Nutri-Score não avaliado
      </span>
    )
  }

  const letter = grade.toUpperCase()

  if (variant === 'circle') {
    return (
      <span
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold shadow-sm',
          NUTRI_BG[grade],
          NUTRI_ON[grade],
          className,
        )}
        aria-label={`Nutri-Score ${letter}`}
      >
        {letter}
      </span>
    )
  }

  if (variant === 'pill') {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-md px-2 py-0.5 text-label-sm font-bold shadow-sm',
          NUTRI_BG[grade],
          NUTRI_ON[grade],
          className,
        )}
      >
        Nutri-Score {letter}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-lg px-2 py-0.5 shadow-sm',
        NUTRI_BG[grade],
        NUTRI_ON[grade],
        className,
      )}
      aria-label={`Nutri-Score ${letter}`}
    >
      <span className="text-[12px] leading-tight font-extrabold tracking-wider" aria-hidden>
        NUTRI-SCORE
      </span>
      <span className={cn('rounded bg-white px-1 text-[13px] font-black', NUTRI_TEXT[grade])} aria-hidden>
        {letter}
      </span>
    </span>
  )
}
