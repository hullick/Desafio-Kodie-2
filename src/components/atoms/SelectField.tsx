import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type SelectOption = { value: string; label: string }

export type SelectFieldProps = {
  label: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  /** Ícone à direita (padrão: seta para baixo). */
  icon?: string
  className?: string
}

export function SelectField({
  label,
  options,
  value,
  onChange,
  icon = 'keyboard_arrow_down',
  className,
}: SelectFieldProps) {
  return (
    <div className={cn('relative rounded-xl bg-surface-container-lowest shadow-sm', className)}>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none truncate rounded-xl bg-transparent pr-8 pl-3 text-label-md text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-outline">
        <Icon name={icon} size={18} />
      </span>
    </div>
  )
}
