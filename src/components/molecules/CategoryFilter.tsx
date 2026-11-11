import { Chip } from '../atoms/Chip'
import { SelectField, type SelectOption } from '../atoms/SelectField'

export type CategoryFilterProps = {
  /** Categorias; o valor "" representa "todas". */
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  /** select → menu (mobile) · chips → botões (barra lateral desktop). */
  variant?: 'select' | 'chips'
}

export function CategoryFilter({ options, value, onChange, variant = 'select' }: CategoryFilterProps) {
  if (variant === 'select') {
    return (
      <SelectField
        label="Filtrar por categoria"
        options={[{ value: '', label: 'Todas Categorias' }, ...options]}
        value={value}
        onChange={onChange}
      />
    )
  }

  return (
    <fieldset>
      <legend className="mb-2 block text-label-lg text-on-surface">Categorias</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <Chip
            key={o.value}
            tone="muted"
            showCheck
            selected={value === o.value}
            onClick={() => onChange(value === o.value ? '' : o.value)}
          >
            {o.label}
          </Chip>
        ))}
      </div>
    </fieldset>
  )
}
