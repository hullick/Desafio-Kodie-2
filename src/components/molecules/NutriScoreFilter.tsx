import { cn } from '../../lib/cn'
import { NUTRI_GRADES, type NutriGrade } from '../../types/nutrition'
import { NUTRI_BG, NUTRI_ON } from '../../lib/nutritionStyles'
import { BadgeNutriScore } from '../atoms/BadgeNutriScore'
import { Chip } from '../atoms/Chip'

export type NutriScoreFilterProps = {
  /** Notas selecionadas. Vazio = todas. */
  selected: NutriGrade[]
  onChange: (selected: NutriGrade[]) => void
  /** chips → linha rolável com "Todos" (mobile) · grid → 5 quadrados (barra lateral desktop). */
  variant?: 'chips' | 'grid'
}

function toggle(list: NutriGrade[], grade: NutriGrade): NutriGrade[] {
  return list.includes(grade) ? list.filter((g) => g !== grade) : [...list, grade]
}

export function NutriScoreFilter({ selected, onChange, variant = 'chips' }: NutriScoreFilterProps) {
  const all = selected.length === 0

  if (variant === 'grid') {
    return (
      <fieldset>
        <legend className="mb-2 block text-label-lg text-on-surface">Nutri-Score</legend>
        <div className="grid grid-cols-5 gap-1.5">
          {NUTRI_GRADES.map((g) => {
            const active = selected.includes(g)
            return (
              <button
                key={g}
                type="button"
                aria-pressed={active}
                aria-label={`Nutri-Score ${g.toUpperCase()}`}
                onClick={() => onChange(toggle(selected, g))}
                className={cn(
                  'flex h-10 items-center justify-center rounded-xl text-headline-sm transition-all',
                  NUTRI_BG[g],
                  NUTRI_ON[g],
                  active ? 'shadow-sm ring-2 ring-primary ring-offset-2' : all ? 'opacity-90 hover:opacity-100' : 'opacity-40 hover:opacity-100',
                )}
              >
                {g.toUpperCase()}
              </button>
            )
          })}
        </div>
        <p className="mt-1.5 text-body-sm text-outline">
          {all ? 'Mostrando todas as classificações' : `Filtrando por ${selected.map((g) => g.toUpperCase()).join('/')}`}
        </p>
      </fieldset>
    )
  }

  return (
    <section aria-label="Filtro por Nutri-Score" className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-label-sm tracking-wider text-on-surface-variant uppercase">Classificação Nutri-Score</span>
        <span className="text-body-sm text-outline">Toque para filtrar</span>
      </div>
      <div className="no-scrollbar -mx-margin flex items-center gap-1 overflow-x-auto px-margin py-1">
        <Chip selected={all} showCheck onClick={() => onChange([])}>
          Todos
        </Chip>
        {NUTRI_GRADES.map((g) => (
          <Chip
            key={g}
            selected={selected.includes(g)}
            onClick={() => onChange(toggle(selected, g))}
            leading={<BadgeNutriScore grade={g} variant="circle" />}
          >
            Nutri-Score {g.toUpperCase()}
          </Chip>
        ))}
      </div>
    </section>
  )
}
