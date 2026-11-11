import { NOVA_GROUPS, type NovaGroup } from '../../types/nutrition'
import { NOVA_LABEL } from '../../lib/nutritionStyles'
import { BadgeNova } from '../atoms/BadgeNova'

export type NovaFilterProps = {
  selected: NovaGroup[]
  onChange: (selected: NovaGroup[]) => void
}

/** Lista de grupos NOVA com caixas de seleção. */
export function NovaFilter({ selected, onChange }: NovaFilterProps) {
  const toggle = (g: NovaGroup) =>
    onChange(selected.includes(g) ? selected.filter((x) => x !== g) : [...selected, g])

  return (
    <fieldset>
      <legend className="mb-2 block text-label-lg text-on-surface">Classificação NOVA</legend>
      <div className="space-y-1.5">
        {NOVA_GROUPS.map((g) => (
          <label
            key={g}
            className="flex cursor-pointer items-center justify-between rounded-xl bg-surface-container-low p-2 transition-colors hover:bg-surface-container"
          >
            <span className="flex items-center gap-2">
              <BadgeNova group={g} variant="square" />
              <span className="text-body-md text-on-surface">{NOVA_LABEL[g]}</span>
            </span>
            <input
              type="checkbox"
              checked={selected.includes(g)}
              onChange={() => toggle(g)}
              className="h-4 w-4 cursor-pointer rounded accent-primary"
            />
          </label>
        ))}
      </div>
    </fieldset>
  )
}
