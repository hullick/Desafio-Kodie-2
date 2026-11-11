import { cn } from '../../lib/cn'
import { NUTRI_BG, NUTRI_ON, NUTRI_TEXT } from '../../lib/nutritionStyles'
import type { NutriGrade } from '../../types/nutrition'
import { Icon } from './Icon'

/**
 * label  → "NUTRI-SCORE [A]" (cards mobile)
 * pill   → "Nutri-Score A" (cards desktop)
 * circle → letra em círculo (chips de filtro)
 * scale  → escala A–E com a nota ativa destacada (detalhe do produto)
 */
export type BadgeNutriScoreVariant = 'label' | 'pill' | 'circle' | 'scale'

export type BadgeNutriScoreProps = {
  grade?: NutriGrade | null
  variant?: BadgeNutriScoreVariant
  className?: string
}

const SCALE: NutriGrade[] = ['a', 'b', 'c', 'd', 'e']

export function BadgeNutriScore({ grade, variant = 'label', className }: BadgeNutriScoreProps) {
  if (variant === 'scale') {
    return (
      <div
        role="img"
        aria-label={grade ? `Nutri-Score ${grade.toUpperCase()}` : 'Nutri-Score não avaliado'}
        className={cn('flex items-center gap-1.5', className)}
      >
        {SCALE.map((g) =>
          g === grade ? (
            <span
              key={g}
              className={cn(
                'z-10 flex h-12 w-11 -translate-y-0.5 flex-col items-center justify-center rounded-xl shadow-md',
                NUTRI_BG[g],
                NUTRI_ON[g],
              )}
            >
              <span className="text-headline-lg leading-none font-black">{g.toUpperCase()}</span>
              <span className="-mt-0.5 text-[8px] font-bold tracking-tight uppercase">Score</span>
            </span>
          ) : (
            <span
              key={g}
              className={cn(
                'flex h-10 w-8 items-center justify-center rounded-lg text-label-lg font-bold opacity-40',
                NUTRI_BG[g],
                NUTRI_ON[g],
              )}
            >
              {g.toUpperCase()}
            </span>
          ),
        )}
      </div>
    )
  }

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
