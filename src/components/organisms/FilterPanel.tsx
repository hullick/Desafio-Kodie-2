import { EMPTY_FILTERS, type FilterState } from '../../types/filters'
import { Icon } from '../atoms/Icon'
import type { SelectOption } from '../atoms/SelectField'
import { CategoryFilter } from '../molecules/CategoryFilter'
import { NovaFilter } from '../molecules/NovaFilter'
import { NutriScoreFilter } from '../molecules/NutriScoreFilter'
import { SortControl } from '../molecules/SortControl'
import { ThresholdBar, type ThresholdBarProps } from '../molecules/ThresholdBar'
import { TipCard } from '../molecules/TipCard'

export type FilterPanelProps = {
  value: FilterState
  onChange: (value: FilterState) => void
  categories: SelectOption[]
  /** inline → chips + selects acima da lista (mobile) · sidebar → painel lateral completo (desktop). */
  variant: 'inline' | 'sidebar'
  /** Ordenação (exibida no modo inline, ao lado da categoria). */
  sort?: { options: SelectOption[]; value: string; onChange: (v: string) => void }
  thresholds?: ThresholdBarProps[]
  claims?: SelectOption[]
  tip?: { title: string; text: string }
}

export function FilterPanel({ value, onChange, categories, variant, sort, thresholds = [], claims = [], tip }: FilterPanelProps) {
  const set = <K extends keyof FilterState>(key: K, v: FilterState[K]) => onChange({ ...value, [key]: v })

  if (variant === 'inline') {
    return (
      <div className="flex flex-col gap-space-md">
        <NutriScoreFilter variant="chips" selected={value.nutriscore} onChange={(v) => set('nutriscore', v)} />
        <div className="grid grid-cols-2 gap-space-xs">
          <CategoryFilter options={categories} value={value.category} onChange={(v) => set('category', v)} />
          {sort && <SortControl options={sort.options} value={sort.value} onChange={sort.onChange} />}
        </div>
      </div>
    )
  }

  const toggleClaim = (c: string) =>
    set('claims', value.claims.includes(c) ? value.claims.filter((x) => x !== c) : [...value.claims, c])

  return (
    <aside className="w-full space-y-space-md">
      <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
        <div className="mb-space-sm flex items-center justify-between pb-space-sm">
          <h2 className="flex items-center gap-1.5 text-headline-sm text-on-surface">
            <Icon name="filter_alt" size={20} className="text-primary" /> Filtros
          </h2>
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="text-label-sm tracking-wider text-primary uppercase transition-colors hover:text-primary-container"
          >
            Limpar tudo
          </button>
        </div>

        <div className="py-space-sm">
          <NutriScoreFilter variant="grid" selected={value.nutriscore} onChange={(v) => set('nutriscore', v)} />
        </div>
        <div className="py-space-sm">
          <NovaFilter selected={value.nova} onChange={(v) => set('nova', v)} />
        </div>

        {thresholds.length > 0 && (
          <div className="space-y-3 py-space-sm">
            <h3 className="text-label-lg text-on-surface">Limiares Nutricionais</h3>
            {thresholds.map((t) => (
              <ThresholdBar key={t.label} {...t} />
            ))}
          </div>
        )}

        <div className="py-space-sm">
          <CategoryFilter variant="chips" options={categories} value={value.category} onChange={(v) => set('category', v)} />
        </div>

        {claims.length > 0 && (
          <fieldset className="pt-space-sm">
            <legend className="mb-2 block text-label-lg text-on-surface">Alegações Especiais</legend>
            <div className="space-y-1.5">
              {claims.map((c) => (
                <label key={c.value} className="flex cursor-pointer items-center gap-2 text-body-sm text-on-surface-variant">
                  <input
                    type="checkbox"
                    checked={value.claims.includes(c.value)}
                    onChange={() => toggleClaim(c.value)}
                    className="h-4 w-4 cursor-pointer rounded accent-primary"
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      {tip && (
        <TipCard variant="stacked" title={tip.title}>
          {tip.text}
        </TipCard>
      )}
    </aside>
  )
}
