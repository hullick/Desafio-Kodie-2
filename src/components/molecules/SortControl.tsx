import { Chip } from '../atoms/Chip'
import { SelectField, type SelectOption } from '../atoms/SelectField'

export type SortControlProps = {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  /** select → menu (mobile) · segmented → botões lado a lado (desktop). */
  variant?: 'select' | 'segmented'
}

export function SortControl({ options, value, onChange, variant = 'select' }: SortControlProps) {
  if (variant === 'select') {
    return <SelectField label="Ordenar produtos" options={options} value={value} onChange={onChange} icon="swap_vert" />
  }

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0" role="group" aria-label="Ordenar produtos">
      <span className="mr-1 text-label-sm tracking-wider whitespace-nowrap text-outline uppercase">Ordenar:</span>
      {options.map((o) => (
        <Chip
          key={o.value}
          shape="rounded"
          tone="muted"
          selectedTone="primary"
          selected={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </Chip>
      ))}
    </div>
  )
}
